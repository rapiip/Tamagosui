import { useCurrentAccount } from "@mysten/dapp-kit";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";

export default function WalletProfile() {
  const acc = useCurrentAccount();
  if (!acc) return null;

  const short = `${acc.address.slice(0, 6)}...${acc.address.slice(-4)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(acc.address);
    } catch (e) {
      // noop
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-full border bg-background px-3 py-1 shadow-sm">
      <span className="text-xs font-medium">Wallet</span>
      <code className="text-xs">{short}</code>
      <Button size="sm" variant="secondary" className="h-7 px-2" onClick={copy}>
        <CopyIcon className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
