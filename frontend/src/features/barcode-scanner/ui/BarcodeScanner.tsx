import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Zap, ZapOff } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface BarcodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  disabled?: boolean;
  actionButton: React.ReactElement;
}

export const BarcodeScanner = ({ onScanSuccess, disabled, actionButton }: BarcodeScannerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [hasFlash, setHasFlash] = useState(false);
  const qrScannerRef = useRef<Html5Qrcode | null>(null);
  const SCANNER_ID = 'isbn-scanner-view';

  const getVideoTrack = (): MediaStreamTrack | null => {
    const video = document.getElementById(SCANNER_ID)?.querySelector('video');
    return (video?.srcObject as MediaStream | null)?.getVideoTracks()[0] || null;
  };

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(async () => {
      try {
        const instance = new Html5Qrcode(SCANNER_ID, {
          formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13],
          verbose: false,
        });
        qrScannerRef.current = instance;

        await instance.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 260, height: 140 } },
          (text) => {
            onScanSuccess(text);
            setIsOpen(false);
          },
          () => {},
        );

        const track = getVideoTrack();
        setHasFlash(
          !!track &&
            typeof track.getCapabilities === 'function' &&
            'torch' in track.getCapabilities(),
        );
      } catch (err) {
        console.error('Camera initialization failed:', err);
        setIsOpen(false);
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      if (qrScannerRef.current?.isScanning) {
        qrScannerRef.current
          .stop()
          .then(() => {
            qrScannerRef.current = null;
          })
          .catch(console.error);
      }
      setIsFlashOn(false);
      setHasFlash(false);
    };
  }, [isOpen]);

  const toggleFlash = async () => {
    const track = getVideoTrack();
    if (!track) return;
    try {
      const nextState = !isFlashOn;
      await track.applyConstraints({ advanced: [{ torch: nextState }] } as any);
      setIsFlashOn(nextState);
    } catch (err) {
      console.error('Flash toggle failed:', err);
    }
  };

  if (!React.isValidElement(actionButton)) return actionButton;

  return (
    <>
      {React.cloneElement(actionButton as any, {
        onClick: () => setIsOpen(true),
        disabled,
        'data-scanning': isOpen ? 'true' : undefined,
      })}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-sidebar rounded-2xl border border-white/10 p-6 shadow-2xl lg:max-w-md">
          <DialogHeader className="flex">
            <DialogTitle className="text-sm font-semibold tracking-wide uppercase">
              Barcode Scanner
            </DialogTitle>

            <div className="flex flex-row items-center justify-between">
              <DialogDescription className="text-foreground/40 text-xs">
                Align barcode inside the frame.
              </DialogDescription>

              {hasFlash && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={toggleFlash}
                  className={`h-7 rounded-lg px-2.5 text-xs ${isFlashOn ? 'bg-amber-500/10 text-amber-500' : 'text-foreground/40'}`}
                >
                  {isFlashOn ? (
                    <Zap className="size-3.5 fill-amber-500" />
                  ) : (
                    <ZapOff className="size-3.5" />
                  )}
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-white/5 bg-black lg:aspect-[4/3]">
            <div id={SCANNER_ID} className="h-full w-full" />
            <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-md bg-black px-2 py-1 backdrop-blur-lg">
              <span className="h-1 w-1 animate-ping rounded-full bg-red-600" />
              <span className="text-tiny font-medium text-red-600 uppercase">Live</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
