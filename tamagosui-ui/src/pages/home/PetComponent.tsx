import { useEffect, useState } from "react";
import {
  CoinsIcon,
  HeartIcon,
  StarIcon,
  Loader2Icon,
  BatteryIcon,
  DrumstickIcon,
  PlayIcon,
  BedIcon,
  BriefcaseIcon,
  ZapIcon,
  ChevronUpIcon,
  PencilIcon,
  CheckIcon,
  XIcon,
  ImageIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { StatDisplay } from "./components/StatDisplay";
import { ActionButton } from "./components/ActionButton";
import { WardrobeManager } from "./components/Wardrobe";
import PetGallery from "./components/PetGallery";

import { useMutateCheckAndLevelUp } from "@/hooks/useMutateCheckLevel";
import { useMutateFeedPet } from "@/hooks/useMutateFeedPet";
import { useMutateLetPetSleep } from "@/hooks/useMutateLetPetSleep";
import { useMutatePlayWithPet } from "@/hooks/useMutatePlayWithPet";
import { useMutateWakeUpPet } from "@/hooks/useMutateWakeUpPet";
import { useMutateWorkForCoins } from "@/hooks/useMutateWorkForCoins";
import { useQueryGameBalance } from "@/hooks/useQueryGameBalance";

import type { PetStruct } from "@/types/Pet";

type PetDashboardProps = {
  pet: PetStruct;
};

export default function PetComponent({ pet }: PetDashboardProps) {
  const { data: gameBalance, isLoading: isLoadingGameBalance } =
    useQueryGameBalance();

  const [displayStats, setDisplayStats] = useState(pet.stats);

  // rename (UI only; belum call on-chain)
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(pet.name);
  const saveNameLocal = () => {
    pet.name = tempName;
    setIsEditingName(false);
  };

  // actions
  const { mutate: mutateFeedPet, isPending: isFeeding } = useMutateFeedPet();
  const { mutate: mutatePlayWithPet, isPending: isPlaying } =
    useMutatePlayWithPet();
  const { mutate: mutateWorkForCoins, isPending: isWorking } =
    useMutateWorkForCoins();

  const { mutate: mutateLetPetSleep, isPending: isSleeping } =
    useMutateLetPetSleep();
  const { mutate: mutateWakeUpPet, isPending: isWakingUp } =
    useMutateWakeUpPet();
  const { mutate: mutateLevelUp, isPending: isLevelingUp } =
    useMutateCheckAndLevelUp();

  useEffect(() => {
    setDisplayStats(pet.stats);
  }, [pet.stats]);

  useEffect(() => {
    if (pet.isSleeping && !isWakingUp && gameBalance) {
      const intervalId = setInterval(() => {
        setDisplayStats((prev) => {
          const energyPerSecond =
            1000 / Number(gameBalance.sleep_energy_gain_ms);
          const hungerLossPerSecond =
            1000 / Number(gameBalance.sleep_hunger_loss_ms);
          const happinessLossPerSecond =
            1000 / Number(gameBalance.sleep_happiness_loss_ms);

          return {
            energy: Math.min(
              gameBalance.max_stat,
              prev.energy + energyPerSecond
            ),
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
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl">Loading Game Rules...</h1>
      </div>
    );

  const isAnyActionPending =
    isFeeding || isPlaying || isSleeping || isWorking || isLevelingUp;

  const canFeed =
    !pet.isSleeping &&
    pet.stats.hunger < gameBalance.max_stat &&
    pet.game_data.coins >= Number(gameBalance.feed_coins_cost);
  const canPlay =
    !pet.isSleeping &&
    pet.stats.energy >= gameBalance.play_energy_loss &&
    pet.stats.hunger >= gameBalance.play_hunger_loss;
  const canWork =
    !pet.isSleeping &&
    pet.stats.energy >= gameBalance.work_energy_loss &&
    pet.stats.happiness >= gameBalance.work_happiness_loss &&
    pet.stats.hunger >= gameBalance.work_hunger_loss;
  const canLevelUp =
    !pet.isSleeping &&
    pet.game_data.experience >=
      pet.game_data.level * Number(gameBalance.exp_per_level);

  return (
    <TooltipProvider>
      {/* max-w diperlebar agar dua kolom terasa luas */}
      <Card className="w-full max-w-4xl bg-white/80 backdrop-blur-sm shadow-lg border border-white/50 border-2 border-white/40 bg-white/70 backdrop-blur-md shadow-xl ring-1 ring-black/5 dark:bg-neutral-900/50">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between gap-2">
            <div className="w-6" />
            <div className="flex-1">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    className="w-full rounded-md border px-3 py-2 text-lg"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    maxLength={32}
                    autoFocus
                  />
                </div>
              ) : (
                <CardTitle className="text-4xl">{pet.name}</CardTitle>
              )}
              <CardDescription className="text-lg">
                Level {pet.game_data.level}
              </CardDescription>
            </div>

            {!isEditingName ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsEditingName(true)}
                title="Rename"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button size="sm" onClick={saveNameLocal} title="Save">
                  <CheckIcon className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    setTempName(pet.name);
                    setIsEditingName(false);
                  }}
                  title="Cancel"
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {/* === GRID 2 KOLOM: kiri (stats+actions), kanan (gallery) === */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* KIRI */}
            <div className="space-y-5">
              {/* Avatar */}
              <div className="flex justify-center">
                <img
                  src={pet.image_url}
                  alt={pet.name}
                  className="h-36 w-36 rounded-full border-4 border-primary/20 object-cover"
                />
              </div>

              {/* Coins & XP */}
              <div className="flex justify-between items-center text-lg">
                <Tooltip>
                  <TooltipTrigger className="flex items-center gap-2">
                    <CoinsIcon className="w-5 h-5 text-yellow-500" />
                    <span className="font-bold">{pet.game_data.coins}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Coins</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger className="flex items-center gap-2">
                    <span className="font-bold">{pet.game_data.experience}</span>
                    <StarIcon className="w-5 h-5 text-purple-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Experience Points (XP)</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Stat Bars */}
              <div className="space-y-2">
                <StatDisplay
                  icon={<BatteryIcon className="text-green-500" />}
                  label="Energy"
                  value={displayStats.energy}
                />
                <StatDisplay
                  icon={<HeartIcon className="text-pink-500" />}
                  label="Happiness"
                  value={displayStats.happiness}
                />
                <StatDisplay
                  icon={<DrumstickIcon className="text-orange-500" />}
                  label="Hunger"
                  value={displayStats.hunger}
                />
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={() => mutateLevelUp({ petId: pet.id })}
                  disabled={!canLevelUp || isAnyActionPending}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isLevelingUp ? (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ChevronUpIcon className="mr-2 h-4 w-4" />
                  )}
                  Level Up!
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <ActionButton
                    onClick={() => mutateFeedPet({ petId: pet.id })}
                    disabled={!canFeed || isAnyActionPending}
                    isPending={isFeeding}
                    label="Feed"
                    icon={<DrumstickIcon />}
                  />
                  <ActionButton
                    onClick={() => mutatePlayWithPet({ petId: pet.id })}
                    disabled={!canPlay || isAnyActionPending}
                    isPending={isPlaying}
                    label="Play"
                    icon={<PlayIcon />}
                  />
                  <div className="col-span-2">
                    <ActionButton
                      onClick={() => mutateWorkForCoins({ petId: pet.id })}
                      disabled={!canWork || isAnyActionPending}
                      isPending={isWorking}
                      label="Work"
                      icon={<BriefcaseIcon />}
                    />
                  </div>
                </div>

                <div>
                  {pet.isSleeping ? (
                    <Button
                      onClick={() => mutateWakeUpPet({ petId: pet.id })}
                      disabled={isWakingUp}
                      className="w-full bg-yellow-500 hover:bg-yellow-600"
                    >
                      {isWakingUp ? (
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <ZapIcon className="mr-2 h-4 w-4" />
                      )}
                      Wake Up!
                    </Button>
                  ) : (
                    <Button
                      onClick={() => mutateLetPetSleep({ petId: pet.id })}
                      disabled={isAnyActionPending}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isSleeping ? (
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <BedIcon className="mr-2 h-4 w-4" />
                      )}
                      Sleep
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* KANAN: GALLERY */}
            <div className="space-y-2">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <ImageIcon className="h-4 w-4" /> GALLERY
              </div>

              {/* opsional: maksimum tinggi + scroll jika terlalu banyak */}
              {/* <div className="max-h-[400px] overflow-y-auto pr-1"> */}
              <PetGallery petId={pet.id} fallbackImages={[pet.image_url]} />
              {/* </div> */}
            </div>
          </div>
        </CardContent>

        {/* Wardrobe tetap di bawah, full width */}
        <WardrobeManager
          pet={pet}
          isAnyActionPending={isAnyActionPending || pet.isSleeping}
        />
      </Card>
    </TooltipProvider>
  );
}
