import { useEffect, useState } from "react";
import {
  CoinsIcon,
  HeartIcon,
  Loader2Icon,
  BatteryIcon,
  DrumstickIcon,
  PlayIcon,
  BedIcon,
  BriefcaseIcon,
  ImagePlusIcon,
  UploadIcon,
  EditIcon,
  ZapIcon
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatDisplay } from "./components/StatDisplay";
import { ActionButton } from "./components/ActionButton";
import { WardrobeManager } from "./components/Wardrobe";

import { useMutateCheckAndLevelUp } from "@/hooks/useMutateCheckLevel";
import { useMutateFeedPet } from "@/hooks/useMutateFeedPet";
import { useMutateLetPetSleep } from "@/hooks/useMutateLetPetSleep";
import { useMutatePlayWithPet } from "@/hooks/useMutatePlayWithPet";
import { useMutateWakeUpPet } from "@/hooks/useMutateWakeUpPet";
import { useMutateWorkForCoins } from "@/hooks/useMutateWorkForCoins";
import { useQueryGameBalance } from "@/hooks/useQueryGameBalance";
import { useQueryEquippedAccessory } from "@/hooks/useQueryEquippedAccessory";

import type { PetStruct } from "@/types/Pet";

type PetDashboardProps = {
  pet: PetStruct;
};

const WEAPON_LVL1_URL = "https://violet-chemical-hyena-806.mypinata.cloud/ipfs/bafybeicgo2m7quijicl4oncixm2baddqrjbxoqfikxi77asu5gadyzsusu";
const WEAPON_LVL2_URL = "https://violet-chemical-hyena-806.mypinata.cloud/ipfs/bafybeihl4z4vvjz4mrx3lavlxkatm3mjfvveheav75yuouja43ohv6zmze";
const WEAPON_LVL3_URL = "https://violet-chemical-hyena-806.mypinata.cloud/ipfs/bafybeidxnwroaigchdr4e3rfm6gu2om3lqymibxmm53g5hc4ywdyyy6ely";

export default function PetComponent({ pet }: PetDashboardProps) {
  const { data: gameBalance, isLoading: isLoadingGameBalance } = useQueryGameBalance();
  const { data: equippedAccessory } = useQueryEquippedAccessory({ petId: pet.id });
  const [displayStats, setDisplayStats] = useState(pet.stats);

  const { mutate: mutateFeedPet, isPending: isFeeding } = useMutateFeedPet();
  const { mutate: mutatePlayWithPet, isPending: isPlaying } = useMutatePlayWithPet();
  const { mutate: mutateWorkForCoins, isPending: isWorking } = useMutateWorkForCoins();
  const { mutate: mutateLetPetSleep, isPending: isSleeping } = useMutateLetPetSleep();
  const { mutate: mutateWakeUpPet, isPending: isWakingUp } = useMutateWakeUpPet();
  const { mutate: mutateLevelUp, isPending: isLevelingUp } = useMutateCheckAndLevelUp();

  useEffect(() => {
    setDisplayStats(pet.stats);
  }, [pet.stats]);

  useEffect(() => {
    if (pet.isSleeping && !isWakingUp && gameBalance) {
      const intervalId = setInterval(() => {
        setDisplayStats((prev) => {
          const energyPerSecond = 1000 / Number(gameBalance.sleep_energy_gain_ms);
          const hungerLossPerSecond = 1000 / Number(gameBalance.sleep_hunger_loss_ms);
          const happinessLossPerSecond = 1000 / Number(gameBalance.sleep_happiness_loss_ms);

          return {
            energy: Math.min(gameBalance.max_stat, prev.energy + energyPerSecond),
            hunger: Math.max(0, prev.hunger - hungerLossPerSecond),
            happiness: Math.max(0, prev.happiness - happinessLossPerSecond),
          };
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [pet.isSleeping, isWakingUp, gameBalance]);

  if (isLoadingGameBalance || !gameBalance)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2Icon className="w-10 h-10 animate-spin text-gray-700" />
      </div>
    );

  const isAnyActionPending = isFeeding || isPlaying || isSleeping || isWorking || isLevelingUp;
  const canFeed = !pet.isSleeping && pet.stats.hunger < gameBalance.max_stat && pet.game_data.coins >= Number(gameBalance.feed_coins_cost);
  const canPlay = !pet.isSleeping && pet.stats.energy >= gameBalance.play_energy_loss && pet.stats.hunger >= gameBalance.play_hunger_loss;
  const canWork = !pet.isSleeping && pet.stats.energy >= gameBalance.work_energy_loss && pet.stats.happiness >= gameBalance.work_happiness_loss && pet.stats.hunger >= gameBalance.work_hunger_loss;
  const canLevelUp = !pet.isSleeping && pet.game_data.experience >= pet.game_data.level * Number(gameBalance.exp_per_level);

  // Dynamic weapon logic
  const isWeaponEquipped = equippedAccessory?.name === "weapon";
  let activeWeaponUrl = WEAPON_LVL1_URL;
  if (pet.game_data.level === 2) activeWeaponUrl = WEAPON_LVL2_URL;
  if (pet.game_data.level >= 3) activeWeaponUrl = WEAPON_LVL3_URL;

  // Mock gallery images
  const mockGallery = [
    pet.image_url,
    WEAPON_LVL1_URL,
    WEAPON_LVL2_URL,
    WEAPON_LVL3_URL
  ];

  return (
    <div className="w-full max-w-4xl glass-card rounded-[2rem] p-8 animate-in zoom-in-95 duration-500 relative">
      {/* Header Section */}
      <div className="relative text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          {pet.name}
        </h2>
        <p className="text-sm text-gray-500 font-medium">
          Level {pet.game_data.level}
        </p>
        <button className="absolute right-0 top-0 p-2 text-gray-400 hover:text-gray-700 bg-white/50 rounded-full transition-colors">
          <EditIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Main Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Left Column: Pet Info & Actions */}
        <div className="flex flex-col space-y-6">
          
          {/* Profile Image & Coins */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4 flex items-center justify-center">
              <img
                src={(isWeaponEquipped && !pet.isSleeping) ? activeWeaponUrl : pet.image_url}
                alt={pet.name}
                className="w-32 h-32 rounded-full border-4 border-green-500/20 object-cover shadow-sm bg-orange-100 z-10 transition-all duration-300"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            
            <div className="w-full flex justify-between items-center px-4 text-sm font-semibold text-gray-700">
              <div className="flex items-center gap-1.5">
                <CoinsIcon className="w-4 h-4 text-yellow-500" />
                <span>{pet.game_data.coins}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-purple-500 font-bold">♦</span>
                <span>{pet.game_data.experience}</span>
              </div>
            </div>
          </div>

          {/* Stats Bars */}
          <div className="space-y-1">
            <StatDisplay icon={<HeartIcon className="w-4 h-4 text-green-500" />} label="Energy" value={displayStats.energy} />
            <StatDisplay icon={<DrumstickIcon className="w-4 h-4 text-pink-500" />} label="Hunger" value={displayStats.hunger} />
            <StatDisplay icon={<BatteryIcon className="w-4 h-4 text-yellow-500" />} label="Happiness" value={displayStats.happiness} />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <ActionButton 
              onClick={() => mutateLevelUp({ petId: pet.id })} 
              disabled={!canLevelUp || isAnyActionPending} 
              isPending={isLevelingUp} 
              label="Level Up!" 
              variant="green" 
            />
            
            <div className="grid grid-cols-2 gap-3">
              <ActionButton 
                onClick={() => mutateFeedPet({ petId: pet.id })} 
                disabled={!canFeed || isAnyActionPending} 
                isPending={isFeeding} 
                label="Feed" 
                icon={<DrumstickIcon className="w-4 h-4" />} 
                variant="grey" 
              />
              <ActionButton 
                onClick={() => mutatePlayWithPet({ petId: pet.id })} 
                disabled={!canPlay || isAnyActionPending} 
                isPending={isPlaying} 
                label="Play" 
                icon={<PlayIcon className="w-4 h-4" />} 
                variant="grey" 
              />
            </div>
            
            <ActionButton 
              onClick={() => mutateWorkForCoins({ petId: pet.id })} 
              disabled={!canWork || isAnyActionPending} 
              isPending={isWorking} 
              label="Work" 
              icon={<BriefcaseIcon className="w-4 h-4" />} 
              variant="grey" 
            />
            
            {pet.isSleeping ? (
              <ActionButton 
                onClick={() => mutateWakeUpPet({ petId: pet.id })} 
                disabled={isWakingUp} 
                isPending={isWakingUp} 
                label="Wake Up!" 
                icon={<ZapIcon className="w-4 h-4" />} 
                variant="blue" 
              />
            ) : (
              <ActionButton 
                onClick={() => mutateLetPetSleep({ petId: pet.id })} 
                disabled={isAnyActionPending} 
                isPending={isSleeping} 
                label="Sleep" 
                icon={<BedIcon className="w-4 h-4" />} 
                variant="blue" 
              />
            )}
          </div>
        </div>

        {/* Right Column: Gallery */}
        <div className="flex flex-col">
          <h3 className="text-xs font-bold text-gray-400 tracking-widest mb-4 flex items-center justify-center gap-2">
            <ImagePlusIcon className="w-3 h-3" /> GALLERY
          </h3>
          
          <div className="bg-white/40 rounded-xl p-4 flex flex-col gap-4">
            <div className="flex gap-2">
              <Input 
                placeholder="New Image URL, JPG/PNG" 
                className="bg-white border-none shadow-sm text-sm"
              />
              <Button size="sm" variant="outline" className="bg-white whitespace-nowrap shadow-sm border-none text-gray-700">
                + Add
              </Button>
              <Button size="sm" variant="outline" className="bg-white whitespace-nowrap shadow-sm border-none text-gray-700">
                <UploadIcon className="w-3 h-3 mr-1" /> Upload
              </Button>
            </div>
            <p className="text-[10px] text-gray-500 leading-tight">
              * URLs must be IPFS/Arweave links with direct image extension (.png/.jpg). If uploading directly, images will be stored on IPFS. Avoid using regular web URLs.
            </p>
            
            <div className="grid grid-cols-2 gap-3 mt-2">
              {mockGallery.map((img, i) => (
                <div key={i} className="aspect-square rounded-xl bg-orange-100 overflow-hidden border border-white/50 shadow-sm">
                  <img src={img} alt="Gallery item" className="w-full h-full object-cover" style={{ imageRendering: 'pixelated' }} />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section: Wardrobe */}
      <div className="mt-8 pt-6 border-t border-gray-200/50">
        <WardrobeManager pet={pet} isAnyActionPending={isAnyActionPending || pet.isSleeping} />
      </div>

    </div>
  );
}
