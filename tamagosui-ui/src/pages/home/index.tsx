import { useQueryOwnedPet } from "@/hooks/useQueryOwnedPet";
import { useCurrentAccount } from "@mysten/dapp-kit";
import AdoptComponent from "./AdoptComponent";
import PetComponent from "./PetComponent";
import Header from "@/components/Header";
import WalletProfile from "./components/WalletProfile";

export default function HomePage() {
  const currentAccount = useCurrentAccount();
  const { data: ownedPet, isPending: isOwnedPetLoading } = useQueryOwnedPet();

  return (
    <div className="min-h-screen flex flex-col bg-[url('/bg/background.png')] bg-no-repeat bg-cover bg-center">

      <Header />

      <main className="flex-grow p-4 pt-24">
        <div className="mx-auto max-w-5xl">
          {/* Wallet chip */}
          <div className="mb-4 flex justify-end">
            <WalletProfile />
          </div>

          <div className="flex items-start justify-center">
            {!currentAccount ? (
              <div className="text-center p-8 border-4 border-primary bg-background shadow-[8px_8px_0px_#000]">
                <h2 className="text-4xl uppercase">Please Connect Wallet</h2>
              </div>
            ) : isOwnedPetLoading ? (
              <div className="text-center p-8 border-4 border-primary bg-background shadow-[8px_8px_0px_#000]">
                <h2 className="text-4xl uppercase">Loading Pet...</h2>
              </div>
            ) : ownedPet ? (
              <div className="transition-transform hover:-translate-y-0.5">
                <PetComponent pet={ownedPet} />
              </div>
            ) : (
              <AdoptComponent />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
