import { ConnectButton } from "@mysten/dapp-kit";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4 px-8 bg-black/30 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-widest text-white">
          TAMAGOSUI
        </h1>
        <div className="bg-white text-black rounded-lg overflow-hidden shadow-md">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
