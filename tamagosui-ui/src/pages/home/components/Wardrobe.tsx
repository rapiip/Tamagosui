import { GlassesIcon, SwordIcon, Loader2Icon, WarehouseIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UseMutateEquipAccessory } from "@/hooks/useMutateEquipAccessory";
import { useMutateMintAccessory } from "@/hooks/useMutateMintAccessory";
import { useMutateMintWeapon } from "@/hooks/useMutateMintWeapon";
import { UseMutateUnequipAccessory } from "@/hooks/useMutateUnequipAccessory";
import { useQueryEquippedAccessory } from "@/hooks/useQueryEquippedAccessory";
import { useQueryOwnedAccessories } from "@/hooks/useQueryOwnedAccessories";
import type { PetStruct } from "@/types/Pet";

type WardrobeManagerProps = {
  pet: PetStruct;
  isAnyActionPending: boolean;
};

export function WardrobeManager({
  pet,
  isAnyActionPending,
}: WardrobeManagerProps) {
  const { mutate: mutateMint, isPending: isMinting } = useMutateMintAccessory();
  const { mutate: mutateMintWeapon, isPending: isMintingWeapon } = useMutateMintWeapon();
  const { mutate: mutateEquip, isPending: isEquipping } = UseMutateEquipAccessory();
  const { mutate: mutateUnequip, isPending: isUnequipping } = UseMutateUnequipAccessory();

  const { data: ownedAccessories, isLoading: isLoadingAccessories } = useQueryOwnedAccessories();
  const { data: equippedAccessory, isLoading: isLoadingEquipped } = useQueryEquippedAccessory({ petId: pet.id });

  const isProcessingWardrobe = isMinting || isMintingWeapon || isEquipping || isUnequipping;
  const isLoading = isLoadingAccessories || isLoadingEquipped;

  const renderContent = () => {
    if (isLoading) {
      return <Loader2Icon className="mx-auto h-5 w-5 animate-spin text-gray-400" />;
    }

    if (equippedAccessory) {
      return (
        <div className="flex items-center justify-between w-full bg-white rounded-xl p-2 px-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <img
              src={equippedAccessory.image_url}
              alt={equippedAccessory.name}
              className="w-10 h-10 object-cover bg-gray-100 rounded-lg shadow-sm"
              style={{ imageRendering: 'pixelated' }}
            />
            <span className="text-sm font-semibold text-gray-800">{equippedAccessory.name}</span>
          </div>
          <Button
            onClick={() => mutateUnequip({ petId: pet.id })}
            disabled={isAnyActionPending || isProcessingWardrobe}
            variant="default"
            size="sm"
            className="h-8 rounded-lg bg-black hover:bg-gray-800 text-white font-semibold px-4"
          >
            {isUnequipping ? <Loader2Icon className="h-3 w-3 animate-spin" /> : "Take"}
          </Button>
        </div>
      );
    }

    if (ownedAccessories && ownedAccessories.length > 0) {
      return (
        <div className="flex items-center justify-between w-full bg-white rounded-xl p-2 px-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <img
              src={ownedAccessories[0].image_url}
              alt={ownedAccessories[0].name}
              className="w-10 h-10 object-cover bg-gray-100 rounded-lg opacity-80"
              style={{ imageRendering: 'pixelated' }}
            />
            <span className="text-sm font-semibold text-gray-500">{ownedAccessories[0].name}</span>
          </div>
          <Button
            onClick={() => mutateEquip({ petId: pet.id, accessoryId: ownedAccessories[0].id.id })}
            disabled={isAnyActionPending || isProcessingWardrobe}
            size="sm"
            className="h-8 rounded-lg bg-black hover:bg-gray-800 text-white font-semibold px-4"
          >
            {isEquipping ? <Loader2Icon className="h-3 w-3 animate-spin" /> : "Equip"}
          </Button>
        </div>
      );
    }

    return (
      <div className="flex gap-2 w-full">
        <Button
          onClick={() => mutateMint()}
          disabled={isAnyActionPending || isProcessingWardrobe}
          className="flex-1 bg-white hover:bg-gray-50 text-gray-800 border-none shadow-sm rounded-xl font-medium h-12"
          variant="outline"
        >
          {isMinting ? (
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <GlassesIcon className="mr-2 h-4 w-4" />
          )}
          Glasses
        </Button>
        <Button
          onClick={() => mutateMintWeapon()}
          disabled={isAnyActionPending || isProcessingWardrobe}
          className="flex-1 bg-white hover:bg-gray-50 text-gray-800 border-none shadow-sm rounded-xl font-medium h-12"
          variant="outline"
        >
          {isMintingWeapon ? (
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <SwordIcon className="mr-2 h-4 w-4" />
          )}
          Weapon
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <h3 className="text-xs font-bold text-gray-400 tracking-widest flex items-center gap-2">
        <WarehouseIcon size={14} /> WARDROBE
      </h3>
      <div className="w-full flex items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
}
