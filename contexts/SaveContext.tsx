import { useState, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';
import { Board, Save } from '@/types';
import { trpc } from '@/lib/trpc';

export const [SaveProvider, useSaves] = createContextHook(() => {
  const [saves, setSaves] = useState<Save[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const savesQuery = trpc.saves.listByUser.useQuery(
    { userId: activeUserId ?? '' },
    { enabled: !!activeUserId }
  );

  const boardsQuery = trpc.boards.listByUser.useQuery(
    { userId: activeUserId ?? '' },
    { enabled: !!activeUserId }
  );

  useEffect(() => {
    if (savesQuery.data) {
      setSaves(savesQuery.data);
    }
  }, [savesQuery.data]);

  useEffect(() => {
    if (boardsQuery.data) {
      setBoards(boardsQuery.data);
    }
  }, [boardsQuery.data]);

  const invalidateSaves = useCallback(() => {
    if (activeUserId) {
      queryClient.invalidateQueries({ queryKey: [['saves', 'listByUser'], { input: { userId: activeUserId }, type: 'query' }] });
      queryClient.invalidateQueries({ queryKey: [['saves']] });
    }
  }, [activeUserId, queryClient]);

  const invalidateBoards = useCallback(() => {
    if (activeUserId) {
      queryClient.invalidateQueries({ queryKey: [['boards', 'listByUser'], { input: { userId: activeUserId }, type: 'query' }] });
      queryClient.invalidateQueries({ queryKey: [['boards']] });
    }
  }, [activeUserId, queryClient]);

  const saveImageMutation = trpc.saves.save.useMutation({
    onSuccess: (newSave) => {
      if (newSave) {
        setSaves((prev) => {
          const exists = prev.find((s) => s.user_id === newSave.user_id && s.image_id === newSave.image_id);
          if (exists) return prev;
          return [...prev, newSave];
        });
      }
      invalidateSaves();
    },
  });

  const unsaveImageMutation = trpc.saves.unsave.useMutation({
    onSuccess: (_result, variables) => {
      setSaves((prev) =>
        prev.filter((s) => !(s.user_id === variables.userId && s.image_id === variables.imageId))
      );
      invalidateSaves();
    },
  });

  const createBoardMutation = trpc.boards.create.useMutation({
    onSuccess: (newBoard) => {
      setBoards((prev) => [...prev, newBoard]);
      invalidateBoards();
    },
  });

  const renameBoardMutation = trpc.boards.rename.useMutation({
    onSuccess: (updated) => {
      if (updated) {
        setBoards((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      }
      invalidateBoards();
    },
  });

  const deleteBoardMutation = trpc.boards.delete.useMutation({
    onSuccess: (_result, variables) => {
      setBoards((prev) => prev.filter((b) => b.id !== variables.boardId));
      setSaves((prev) =>
        prev.map((s) => (s.board_id === variables.boardId ? { ...s, board_id: null } : s))
      );
      invalidateBoards();
      invalidateSaves();
    },
  });

  const moveToBoardMutation = trpc.saves.moveToBoard.useMutation({
    onSuccess: (updated) => {
      if (updated) {
        setSaves((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      }
      invalidateSaves();
    },
  });

  const setUser = useCallback((userId: string | null) => {
    setActiveUserId(userId);
    if (!userId) {
      setSaves([]);
      setBoards([]);
    }
  }, []);

  const saveImage = useCallback(
    ({ userId, imageId }: { userId: string; imageId: string }) => {
      if (!activeUserId) setActiveUserId(userId);
      saveImageMutation.mutate({ userId, imageId });
    },
    [saveImageMutation, activeUserId]
  );

  const unsaveImage = useCallback(
    ({ userId, imageId }: { userId: string; imageId: string }) => {
      unsaveImageMutation.mutate({ userId, imageId });
    },
    [unsaveImageMutation]
  );

  const createBoard = useCallback(
    ({ userId, name }: { userId: string; name: string }) => {
      if (!activeUserId) setActiveUserId(userId);
      createBoardMutation.mutate({ userId, name });
    },
    [createBoardMutation, activeUserId]
  );

  const renameBoard = useCallback(
    ({ boardId, name }: { boardId: string; name: string }) => {
      renameBoardMutation.mutate({ boardId, name });
    },
    [renameBoardMutation]
  );

  const deleteBoard = useCallback(
    (boardId: string) => {
      deleteBoardMutation.mutate({ boardId });
    },
    [deleteBoardMutation]
  );

  const moveToBoard = useCallback(
    ({ saveId, boardId }: { saveId: string; boardId: string | null }) => {
      moveToBoardMutation.mutate({ saveId, boardId });
    },
    [moveToBoardMutation]
  );

  const isImageSaved = useCallback(
    (userId: string, imageId: string) => {
      return saves.some((s) => s.user_id === userId && s.image_id === imageId);
    },
    [saves]
  );

  const getUserSaves = useCallback(
    (userId: string) => {
      return saves.filter((s) => s.user_id === userId);
    },
    [saves]
  );

  const getUserBoards = useCallback(
    (userId: string) => {
      return boards.filter((b) => b.user_id === userId);
    },
    [boards]
  );

  const getBoardSaves = useCallback(
    (boardId: string) => {
      return saves.filter((s) => s.board_id === boardId);
    },
    [saves]
  );

  return {
    saves,
    boards,
    setUser,
    saveImage,
    unsaveImage,
    createBoard,
    renameBoard,
    deleteBoard,
    moveToBoard,
    isImageSaved,
    getUserSaves,
    getUserBoards,
    getBoardSaves,
  };
});
