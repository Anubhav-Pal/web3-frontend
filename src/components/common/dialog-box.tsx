import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

type Props = {
  open: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;

  description: string;
  primaryButtonFunction?: () => void;
  primaryButtonLabel?: string;
  children: React.ReactNode;
  className: string;
};

const DialogBox: React.FC<Props> = ({
  open,
  onClose,
  title,
  description,
  primaryButtonFunction,
  primaryButtonLabel,
  children,
  className,
}) => {
  return (
    <div>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className={` ${className}`}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children}
          {primaryButtonLabel && (
            <DialogFooter>
              <Button type="submit" className="min-w-32">
                {primaryButtonLabel}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DialogBox;
