import { Button } from '@/shared/ui';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { XCircle, Zap, ZapOff } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

type InjectorButtonElement = React.ReactElement<
  React.ComponentProps<typeof Button> & {
    'data-scanning'?: boolean;
  }
>;

interface BarcodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  disabled?: boolean;
  actionButton: InjectorButtonElement;
}

export const BarcodeScanner = ({ onScanSuccess, disabled, actionButton }: BarcodeScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [hasFlash, setHasFlash] = useState(false);
  const qrScannerRef = useRef<Html5Qrcode | null>(null);
  const SCANNER_ELEMENT_ID = 'isbn-modular-scanner-view';

  const getVideoTrack = (): MediaStreamTrack | null => {
    const video = document.getElementById(SCANNER_ELEMENT_ID)?.querySelector('video');
    return (video?.srcObject as MediaStream | null)?.getVideoTracks()[0] || null;
  };

  const startScanner = async () => {
    setIsScanning(true);
    setIsFlashOn(false);
    setHasFlash(false);

    setTimeout(async () => {
      try {
        const scannerInstance = new Html5Qrcode(SCANNER_ELEMENT_ID, {
          formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13],
          verbose: false,
        });
        qrScannerRef.current = scannerInstance;

        await scannerInstance.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 260, height: 140 } },
          (decodedText) => {
            onScanSuccess(decodedText);
            stopScanner();
          },
          () => {
            /* Absorb frame misses */
          },
        );

        const track = getVideoTrack();
        if (track && typeof track.getCapabilities === 'function') {
          setHasFlash('torch' in track.getCapabilities());
        }
      } catch (err) {
        console.error('Camera access failed:', err);
        setIsScanning(false);
      }
    }, 120);
  };

  const toggleFlash = async () => {
    if (!qrScannerRef.current?.isScanning || !hasFlash) return;
    try {
      const nextState = !isFlashOn;
      const track = getVideoTrack();
      if (track) {
        await track.applyConstraints({ advanced: [{ torch: nextState }] } as any);
        setIsFlashOn(nextState);
      }
    } catch (err) {
      console.error('Failed to toggle flash:', err);
    }
  };

  const stopScanner = async () => {
    if (qrScannerRef.current?.isScanning) {
      try {
        if (isFlashOn) {
          await getVideoTrack()
            ?.applyConstraints({ advanced: [{ torch: false }] } as any)
            .catch(() => {});
        }
        await qrScannerRef.current.stop();
      } catch (err) {
        console.error('Failed to stop stream:', err);
      }
    }
    qrScannerRef.current = null;
    setIsScanning(false);
    setIsFlashOn(false);
    setHasFlash(false);
  };

  useEffect(() => {
    return () => {
      if (qrScannerRef.current?.isScanning) {
        qrScannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  if (!React.isValidElement(actionButton)) return actionButton;
  const injectorProps = {
    onClick: isScanning ? stopScanner : startScanner,
    disabled: disabled,
    'data-scanning': isScanning,
  };

  return (
    <div className="flex w-full flex-col gap-3">
      {isScanning && (
        <div className="bg-muted/30 animate-in fade-in-50 relative rounded-xl border border-dashed p-3 duration-200">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="flex animate-pulse items-center gap-1.5 text-xs font-semibold text-amber-600">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              Camera Active: Align book barcode
            </span>

            <div className="flex items-center gap-1">
              {hasFlash && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={toggleFlash}
                  className={`h-6 px-2 ${isFlashOn ? 'text-amber-500 hover:text-amber-600' : 'text-muted-foreground'}`}
                >
                  {isFlashOn ? (
                    <Zap className="mr-1 h-3.5 w-3.5 fill-amber-500" />
                  ) : (
                    <ZapOff className="mr-1 h-3.5 w-3.5" />
                  )}
                  {isFlashOn ? 'Flash On' : 'Flash Off'}
                </Button>
              )}

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={stopScanner}
                className="text-muted-foreground hover:text-destructive h-6 px-2"
              >
                <XCircle className="mr-1 h-3.5 w-3.5" /> Turn Off
              </Button>
            </div>
          </div>
          <div
            id={SCANNER_ELEMENT_ID}
            className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-zinc-950"
          ></div>
        </div>
      )}
      {React.cloneElement(actionButton, injectorProps)}
    </div>
  );
};
