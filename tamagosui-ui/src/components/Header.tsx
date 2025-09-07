import { ConnectButton } from "@mysten/dapp-kit";

export default function Header() {
  return (
    <header className="bg-black/40 text-white backdrop-blur-md py-4 px-6">

      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <h1 className="text-5xl font-bold tracking-tighter">TAMAGOSUI</h1>
        <ConnectButton />
      </div>
    </header>
  );
}
