import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ITodo } from "../interfaces";
import { State } from "../constants/state.enum";

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
  const [phantomInstalled, setPhantomInstalled] = useState(false);

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

    if (window.solana) {
      setWalletPubkey(provider.wallet.publicKey);
      setPhantomInstalled(true);
    } else {
      toast.error("Phantom wallet not found! Please install first!");
    }
    return provider;
  }, [walletAddress]);

  const getProgram = useCallback(async () => {
    const idl = await Program.fetchIdl(programID, anchorProvider);
    return new Program(idl as Idl, programID, anchorProvider);
  }, [anchorProvider]);

  const initializeUser = async () => {
    const program = await getProgram();
    if (program && walletPubkey) {
      try {
        setTransactionPending(true);
        const profilePda = findProgramAddressSync(
          [new TextEncoder().encode(State.USER_STATE), walletPubkey.toBuffer()],
          programID
        )[0];

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
      } catch (error) {
        console.log(error);
        toast.error((error as any).toString());
      } finally {
        setTransactionPending(false);
      }
    } else {
      toast.error("You have to connect to wallet first");
    }
  };

  const addTodo = async (content: string) => {
    const program = await getProgram();
    if (program && walletPubkey) {
      try {
        setTransactionPending(true);
        const profilePda = findProgramAddressSync(
          [new TextEncoder().encode(State.USER_STATE), walletPubkey.toBuffer()],
          programID
        )[0];
        const todoPda = findProgramAddressSync(
          [
            new TextEncoder().encode(State.TODO_STATE),
            walletPubkey.toBuffer(),
            Uint8Array.from([newTodoIdx]),
          ],
          program.programId
        )[0];

        await program.methods
          .addTodo(content)
          .accounts({
            userProfile: profilePda,
            todoAccount: todoPda,
            authority: walletPubkey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        toast.success("Todo added successfully!");
      } catch (error) {
        console.log(error);
        toast.error((error as any).toString());
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const toggleTodo = async (idx: number, isCompleted: boolean) => {
    const program = await getProgram();
    if (program && walletPubkey) {
      try {
        setTransactionPending(true);
        setLoading(true);
        const todoPda = findProgramAddressSync(
          [
            new TextEncoder().encode(State.TODO_STATE),
            walletPubkey.toBuffer(),
            Uint8Array.from([idx]),
          ],
          program.programId
        )[0];

        await program.methods
          .toggleTodo(idx)
          .accounts({
            todoAccount: todoPda,
            authority: walletPubkey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        isCompleted
          ? toast.success("Todo has been marked uncompleted!")
          : toast.success("Todo has been marked completed!");
      } catch (error) {
        console.log(error);
        toast.error((error as any).toString());
      } finally {
        setTransactionPending(false);
        setLoading(false);
      }
    }
  };

  const deleteTodo = async (idx: number) => {
    const program = await getProgram();
    if (program && walletPubkey) {
      try {
        setTransactionPending(true);
        setLoading(true);
        const profilePda = findProgramAddressSync(
          [new TextEncoder().encode(State.USER_STATE), walletPubkey.toBuffer()],
          programID
        )[0];
        const todoPda = findProgramAddressSync(
          [
            new TextEncoder().encode(State.TODO_STATE),
            walletPubkey.toBuffer(),
            Uint8Array.from([idx]),
          ],
          program.programId
        )[0];

        await program.methods
          .removeTodo(idx)
          .accounts({
            userProfile: profilePda,
            todoAccount: todoPda,
            authority: walletPubkey,
            SystemProgram: SystemProgram.programId,
          })
          .rpc();

        toast.success("Todo removed successfully!");
      } catch (error) {
        console.log(error);
        toast.error((error as any).toString());
      } finally {
        setTransactionPending(false);
        setLoading(false);
      }
    }
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
          const profilePda = findProgramAddressSync(
            [new TextEncoder().encode("USER_STATE"), walletPubkey.toBuffer()],
            programID
          )[0];
          const profileAccount = await program.account.userProfile.fetch(
            profilePda
          );

          if (profileAccount) {
            setInitialized(true);
            setNewTodoIdx(profileAccount.newTodoIdx);

            const todoAccounts: any = await program.account.todoAccount.all([
              authorFilter(walletPubkey.toString()),
            ]);
            setTodos(todoAccounts.map((account: any) => account.account));
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
  }, [walletPubkey, transactionPending, getProgram]);

  return {
    initialized,
    initializeUser,
    walletAddress,
    setWalletAddress,
    phantomInstalled,
    loading,
    incompletedTodos,
    completedTodos,
    todoActions,
  };
}
