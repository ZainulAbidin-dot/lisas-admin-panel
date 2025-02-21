import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string) {
  const splitName = name.split(' ');
  const firstName = splitName[0];
  const lastName = splitName.length > 1 ? splitName[splitName.length - 1] : '';

  return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
}