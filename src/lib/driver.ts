import { type DriveStep, driver } from "driver.js";

// Basic steps configuration - empty steps for now as requested
export const tourSteps: DriveStep[] = [];

export const runDriver = () => {
  const driverObj = driver({
    showProgress: true,
    steps: tourSteps,
    // Use the custom class defined in globals.css to match the app theme
    popoverClass: "driverjs-theme",
  });

  driverObj.drive();
};

/* 
Usage :
```
import { runDriver, tourSteps } from "@/lib/driver";

// Add steps dynamically if needed, or define them in the module
tourSteps.push({ 
  element: '#some-element', 
  popover: { title: 'Hello', description: 'Welcome to the app' } 
});

// Start the tour
runDriver();
```
*/
