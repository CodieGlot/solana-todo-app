import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ITodo } from "../interfaces";

import { programID, network, connectionOpts } from "../constants/program";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program, AnchorProvider, Idl } from "@project-serum/anchor";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";

import { authorFilter } from "../utils";

import { Buffer } from "buffer";
window.Buffer = Buffer;

export function useTodo() {
  const [initialized, setInitialized] = useState(false);
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [newTodoIdx, setNewTodoIdx] = useState(0);

  const [loading, setLoading] = useState(false);
  const [transactionPending, setTransactionPending] = useState(false);

  const [walletPubkey, setWalletPubkey] = useState<PublicKey | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const anchorProvider = useMemo(() => {
    const connection = new Connection(
      network,
      connectionOpts.preflightCommitment as any
    );
    const provider = new AnchorProvider(
      connection,
      window.solana,
      connectionOpts.preflightCommitment as any
    );

    setWalletPubkey(provider.wallet.publicKey);
    return provider;
  }, [walletAddress]);

  const getProgram = async () => {
    const idl = await Program.fetchIdl(programID, anchorProvider);
    return new Program(idl as Idl, programID, anchorProvider);
  };

  const initializeUser = async () => {
    const program = await getProgram();
    if (program && walletPubkey) {
      try {
        setTransactionPending(true);
        const [profilePda, profileBump] = findProgramAddressSync(
          [new TextEncoder().encode("USER_STATE"), walletPubkey.toBuffer()],
          programID
        );

        await program.methods
          .initializeUser()
          .accounts({
            userProfile: profilePda,
            authority: walletPubkey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        setInitialized(true);
        toast.success("User initialized successfully");
      } catch (error: any) {
        console.log(error);
        toast.error(error.toString());
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const addTodo = (content: string) => {
    /* setTodos((current: ITodo[]) => {
      return [
        ...current,
        { idx: newTodoIdx, content, isCompleted: false },
      ];
    }); */
  };

  const toggleTodo = (idx: number, isCompleted: boolean) => {
    /* setTodos((current: ITodo[]) => {
      return current.map((todo) =>
        todo.idx === idx ? { ...todo, isCompleted } : todo
      );
    }); */
  };

  const deleteTodo = (idx: number) => {
    /* setTodos((current: ITodo[]) => {
      return current.filter((todo) => todo.idx !== idx);
    }); */
  };

  const incompletedTodos = useMemo(
    () => todos.filter((todo) => !todo.isCompleted),
    [todos]
  );
  const completedTodos = useMemo(
    () => todos.filter((todo) => todo.isCompleted),
    [todos]
  );

  const todoActions = {
    addTodo,
    toggleTodo,
    deleteTodo,
  };

  useEffect(() => {
    const findProfileAccount = async () => {
      const program = await getProgram();
      if (program && walletPubkey && !transactionPending) {
        try {
          setLoading(true);
          const [profilePda, profileBump] = findProgramAddressSync(
            [new TextEncoder().encode("USER_STATE"), walletPubkey.toBuffer()],
            programID
          );
          const profileAccount = await program.account.userProfile.fetch(
            profilePda
          );

          if (profileAccount) {
            setInitialized(true);
            setNewTodoIdx(profileAccount.newTodoIdx);

            const todoAccounts: any = await program.account.todoAccount.all([
              authorFilter(walletPubkey.toString()),
            ]);
            setTodos(todoAccounts);
          } else {
            console.log("NOT YET INITIALIZED");
            setInitialized(false);
          }
        } catch (error) {
          console.log(error);
          setInitialized(false);
          setTodos([]);
        } finally {
          setLoading(false);
        }
      }
    };

    findProfileAccount();
  }, [walletPubkey, transactionPending]);

  return {
    initialized,
    initializeUser,
    walletAddress,
    setWalletAddress,
    incompletedTodos,
    completedTodos,
    todoActions,
  };
}
