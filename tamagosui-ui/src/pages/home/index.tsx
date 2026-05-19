import { useQueryOwnedPet } from "@/hooks/useQueryOwnedPet";
import { useCurrentAccount } from "@mysten/dapp-kit";
import AdoptComponent from "./AdoptComponent";
import PetComponent from "./PetComponent";
import Header from "@/components/Header";
import { Loader2Icon, WalletIcon } from "lucide-react";

export default function HomePage() {
  const currentAccount = useCurrentAccount();
  const { data: ownedPet, isPending: isOwnedPetLoading } = useQueryOwnedPet();

  return (
    <div 
      className="min-h-screen flex flex-col font-sans"
      style={{
        backgroundImage: 'url(/bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for better visibility if needed, but keeping it light as requested */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>

      <Header />
      <main className="flex-grow flex items-center justify-center p-4 pt-20 relative z-10">
        {!currentAccount ? (
          <div className="glass-card flex flex-col items-center justify-center p-12 rounded-3xl max-w-md text-center text-black">
            <WalletIcon className="w-16 h-16 mb-4 text-gray-700" />
            <h2 className="text-2xl font-bold mb-2">Connect Wallet</h2>
            <p className="text-gray-600 text-sm">Please connect your Sui wallet to start.</p>
          </div>
        ) : isOwnedPetLoading ? (
          <div className="glass-card flex flex-col items-center justify-center p-12 rounded-3xl max-w-md text-center text-black">
            <Loader2Icon className="w-12 h-12 mb-4 text-gray-700 animate-spin" />
            <h2 className="text-xl font-bold">Loading Pet...</h2>
          </div>
        ) : ownedPet ? (
          <PetComponent pet={ownedPet} />
        ) : (
          <AdoptComponent />
        )}
      </main>
    </div>
  );
}
