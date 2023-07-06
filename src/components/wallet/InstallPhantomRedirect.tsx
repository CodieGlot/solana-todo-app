export function InstallPhantomRedirect() {
  const redirectToPhantomInstalled = () => {
    window.location.href =
      "https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa";
  };

  return (
    <button type="button" onClick={() => redirectToPhantomInstalled()}>
      Install Phantom Wallet
    </button>
  );
}
