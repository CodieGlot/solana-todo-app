type LoadingProps = {
  loading: boolean;
  children: React.ReactNode;
};

export function Loading({ loading, children }: LoadingProps) {
  if (loading) {
    return <h3>...loading...</h3>;
  }
  return <>{children}</>;
}
