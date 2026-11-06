import React from "react";
import { IllusProps } from "./atoms";
import { ChargerAsk, LowBattery, MissedCall, WeakSignal, WifiPassword } from "./scenes1";
import { Gallery, DoorOpen, Knock, SendLocation, SilentMode } from "./scenes2";

export const illustrationMap: Record<string, React.FC<IllusProps>> = {
  lowBattery: LowBattery,
  chargerAsk: ChargerAsk,
  wifiPassword: WifiPassword,
  weakSignal: WeakSignal,
  missedCall: MissedCall,
  silentMode: SilentMode,
  sendLocation: SendLocation,
  gallery: Gallery,
  knock: Knock,
  doorOpen: DoorOpen,
};
