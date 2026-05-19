import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutateAdoptPet } from "@/hooks/useMutateAdoptPet";
import { Loader2Icon, SparklesIcon } from "lucide-react";

const INTIAAL_PET_IMAGE_URL =
  "https://violet-chemical-hyena-806.mypinata.cloud/ipfs/bafkreifvu35eo5djkqbncqqfw7yihtvhx5tjyueheqhgdle3tynfybkhji";

export default function AdoptComponent() {
  const [petName, setPetName] = useState("");
  const { mutate: mutateAdoptPet, isPending: isAdopting } = useMutateAdoptPet();

  const handleAdoptPet = () => {
    if (!petName.trim()) return;
    mutateAdoptPet({ name: petName });
  };

  return (
    <div className="glass-card w-full max-w-md text-center p-8 rounded-[2rem] relative overflow-hidden animate-in fade-in zoom-in duration-500">
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center justify-center gap-2">
          Adopt Pet <SparklesIcon className="w-6 h-6 text-yellow-500" />
        </h2>
        <p className="text-gray-500 text-sm font-medium">A new friend awaits!</p>
      </div>
      
      <div className="space-y-6">
        <div className="flex justify-center">
          <img
            src={INTIAAL_PET_IMAGE_URL}
            alt="Your new pet"
            className="w-40 h-40 object-cover rounded-full border-4 border-white shadow-md bg-orange-100"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        <div className="space-y-4">
          <Input
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            placeholder="Enter pet name..."
            disabled={isAdopting}
            className="text-center font-medium text-lg py-6 bg-white/50 border-white/80 focus:border-gray-300 focus:ring-gray-300 rounded-xl"
          />
        </div>

        <Button
          onClick={handleAdoptPet}
          disabled={!petName.trim() || isAdopting}
          className="w-full h-14 text-lg rounded-xl bg-[#8BC34A] hover:bg-[#7CB342] text-white font-bold shadow-sm transition-all"
        >
          {isAdopting ? (
            <>
              <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />{" "}
              Adopting...
            </>
          ) : (
            "Adopt Now"
          )}
        </Button>
      </div>
    </div>
  );
}
