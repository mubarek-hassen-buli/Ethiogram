#!/usr/bin/env node

/**
 * This script is used to reset the project to a blank state.
 * It deletes or moves the /app, /components, /hooks, /scripts, and /constants directories to /app-example based on user input and creates a new /app directory with an index.tsx and _layout.tsx file.
 * You can remove the `reset-project` script from package.json and safely delete this file after running it.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { exec } = require("child_process");
const os = require("os");

// Check if there are any processes that might be locking files
const checkForLockingProcesses = () => {
  return new Promise((resolve) => {
    if (os.platform() === "win32") {
      exec('tasklist /fi "imagename eq node.exe"', (error, stdout) => {
        if (error) {
          console.log("⚠️ Could not check for running processes.");
          resolve({ hasProcesses: false });
          return;
        }

        if (stdout.includes("node.exe")) {
          console.log(
            "⚠️ Found running Node.js processes that might be locking files:"
          );
          console.log(stdout);
          console.log(
            "💡 Consider terminating these processes before continuing."
          );
          console.log(
            "   You can use Task Manager or run 'taskkill /F /IM node.exe' to end all Node processes."
          );
          resolve({ hasProcesses: true, platform: "win32" });
        } else {
          resolve({ hasProcesses: false });
        }
      });
    } else {
      // For non-Windows platforms
      exec("ps aux | grep node", (error, stdout) => {
        if (error || !stdout.trim()) {
          resolve(false);
          return;
        }

        const lines = stdout
          .split("\n")
          .filter((line) => line.includes("node") && !line.includes("grep"));
        if (lines.length > 0) {
          console.log(
            "⚠️ Found running Node.js processes that might be locking files:"
          );
          console.log(lines.join("\n"));
          console.log(
            "💡 Consider terminating these processes before continuing."
          );
          resolve({ hasProcesses: true, platform: "unix" });
        } else {
          resolve({ hasProcesses: false });
        }
      });
    }
  });
};

const root = process.cwd();
const oldDirs = ["app", "components", "hooks", "constants"];
const scriptDir = "scripts"; // Handle separately since this script is running from here
const exampleDir = "app-example";
const newAppDir = "app";
const exampleDirPath = path.join(root, exampleDir);

const indexContent = `import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
`;

const layoutContent = `import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper function to retry operations with delay
const retryOperation = async (operation, maxRetries = 3, delay = 2000) => {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await operation();
      return; // Success, exit the function
    } catch (error) {
      lastError = error;
      console.log(
        `⚠️ Attempt ${attempt}/${maxRetries} failed: ${error.message}`
      );
      if (attempt < maxRetries) {
        console.log(`⏳ Waiting ${delay / 1000} seconds before retrying...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError; // All retries failed
};

const moveDirectories = async (userInput) => {
  try {
    if (userInput === "y") {
      // Create the app-example directory
      await fs.promises.mkdir(exampleDirPath, { recursive: true });
      console.log(`📁 /${exampleDir} directory created.`);
    }

    // Move old directories to new app-example directory or delete them
    for (const dir of [...oldDirs, scriptDir]) {
      // Skip the scripts directory on the first pass - we'll handle it last
      if (
        dir === scriptDir &&
        [...oldDirs, scriptDir].indexOf(dir) !== oldDirs.length
      ) {
        continue;
      }

      const oldDirPath = path.join(root, dir);
      if (fs.existsSync(oldDirPath)) {
        if (userInput === "y") {
          const newDirPath = path.join(root, exampleDir, dir);
          try {
            // Special handling for scripts directory
            if (dir === scriptDir) {
              // Create the target directory first
              await fs.promises.mkdir(newDirPath, { recursive: true });

              // Copy files instead of moving them
              const files = await fs.promises.readdir(oldDirPath);
              for (const file of files) {
                // Skip this script to avoid issues
                if (file === path.basename(__filename)) continue;

                const srcPath = path.join(oldDirPath, file);
                const destPath = path.join(newDirPath, file);

                // Copy the file
                await fs.promises.copyFile(srcPath, destPath);
              }
              console.log(
                `➡️ /${dir} (except reset-project.js) copied to /${exampleDir}/${dir}.`
              );
            } else {
              // For other directories, move as usual
              await retryOperation(async () => {
                await fs.promises.rename(oldDirPath, newDirPath);
              });
              console.log(`➡️ /${dir} moved to /${exampleDir}/${dir}.`);
            }
          } catch (error) {
            console.error(`❌ Could not move /${dir} after multiple attempts.`);
            if (error.code === "EPERM") {
              console.error(
                `💡 Permission error detected. This is likely because some files are locked by running Node.js processes.`
              );
              console.error(
                `   Try running this script again and select option 2 to automatically terminate Node.js processes.`
              );
              if (os.platform() === "win32") {
                console.error(
                  `   Alternatively, you can manually run 'taskkill /F /IM node.exe' in a new terminal window.`
                );
              }
            } else {
              console.error(
                `💡 This might be because some files are in use. Try closing any running servers or applications.`
              );
            }
            throw error;
          }
        } else {
          try {
            // Special handling for scripts directory
            if (dir === scriptDir) {
              // We can't delete the scripts directory while this script is running
              console.log(
                `⚠️ /${dir} will not be deleted as this script is running from there.`
              );
              console.log(
                `   You can manually delete it after the script completes.`
              );
            } else {
              await retryOperation(async () => {
                await fs.promises.rm(oldDirPath, {
                  recursive: true,
                  force: true,
                });
              });
              console.log(`❌ /${dir} deleted.`);
            }
          } catch (error) {
            console.error(
              `❌ Could not delete /${dir} after multiple attempts.`
            );
            if (error.code === "EPERM") {
              console.error(
                `💡 Permission error detected. This is likely because some files are locked by running Node.js processes.`
              );
              console.error(
                `   Try running this script again and select option 2 to automatically terminate Node.js processes.`
              );
              if (os.platform() === "win32") {
                console.error(
                  `   Alternatively, you can manually run 'taskkill /F /IM node.exe' in a new terminal window.`
                );
              }
            } else {
              console.error(
                `💡 This might be because some files are in use. Try closing any running servers or applications.`
              );
            }
            throw error;
          }
        }
      } else {
        console.log(`➡️ /${dir} does not exist, skipping.`);
      }
    }

    // Create new /app directory
    const newAppDirPath = path.join(root, newAppDir);
    await fs.promises.mkdir(newAppDirPath, { recursive: true });
    console.log("\n📁 New /app directory created.");

    // Create index.tsx
    const indexPath = path.join(newAppDirPath, "index.tsx");
    await fs.promises.writeFile(indexPath, indexContent);
    console.log("📄 app/index.tsx created.");

    // Create _layout.tsx
    const layoutPath = path.join(newAppDirPath, "_layout.tsx");
    await fs.promises.writeFile(layoutPath, layoutContent);
    console.log("📄 app/_layout.tsx created.");

    console.log("\n✅ Project reset complete. Next steps:");
    console.log(
      `1. Run \`npx expo start\` to start a development server.\n2. Edit app/index.tsx to edit the main screen.${
        userInput === "y"
          ? `\n3. Delete the /${exampleDir} directory when you're done referencing it.`
          : ""
      }`
    );
  } catch (error) {
    console.error(`❌ Error during script execution: ${error.message}`);
    console.error(`
💡 Troubleshooting tips:
1. Run this script again and choose option 2 to automatically terminate Node.js processes
2. Close any running development servers (npx expo start, etc.)
3. Close any applications that might be using files in these directories
4. If using Windows, run 'taskkill /F /IM node.exe' in a new terminal window
5. Try running the script again after closing these applications
`);

    // If this is a permission error, offer to terminate processes now
    if (error.code === "EPERM" && os.platform() === "win32") {
      rl.question(
        "\n⚠️ Would you like to terminate all Node.js processes now and try again? (Y/n): ",
        async (answer) => {
          const shouldTerminate = answer.trim().toLowerCase() || "y";
          if (shouldTerminate === "y") {
            console.log("🔄 Attempting to terminate Node.js processes...");
            await terminateNodeProcesses();
            console.log("Please run the script again to continue.");
          }
          rl.close();
        }
      );
    }
  }
};

// Function to terminate Node.js processes
const terminateNodeProcesses = () => {
  return new Promise((resolve) => {
    if (os.platform() === "win32") {
      console.log("🔄 Attempting to terminate all Node.js processes...");
      exec("taskkill /F /IM node.exe", (error) => {
        if (error) {
          console.log("⚠️ Could not terminate all processes automatically.");
          console.log("   Some processes might require manual termination.");
          resolve(false);
        } else {
          console.log("✅ Successfully terminated Node.js processes.");
          // Wait a moment for file locks to be released
          setTimeout(() => resolve(true), 1000);
        }
      });
    } else {
      // For Unix-like systems, we need to be more careful
      console.log(
        "⚠️ Automatic process termination is not supported on this platform."
      );
      console.log("   Please manually terminate the processes and try again.");
      resolve(false);
    }
  });
};

// Check if a specific directory is locked
const checkIfDirectoryLocked = async (dirPath) => {
  // Create a test file path inside the directory
  const testFilePath = path.join(dirPath, `.lock-test-${Date.now()}.tmp`);

  try {
    // Try to write a test file
    await fs.promises.writeFile(testFilePath, "test");
    // If successful, remove it
    await fs.promises.unlink(testFilePath);
    return false; // Not locked
  } catch (error) {
    // If we get EPERM or EBUSY, the directory is likely locked
    if (
      error.code === "EPERM" ||
      error.code === "EBUSY" ||
      error.code === "EACCES"
    ) {
      return true; // Locked
    }
    // For other errors (like directory doesn't exist), return false
    return false;
  }
};

const startReset = async () => {
  // Check for processes that might be locking files
  const { hasProcesses, platform } = await checkForLockingProcesses();

  // Check if app directory is locked (if it exists)
  const appDirPath = path.join(root, "app");
  let appDirLocked = false;

  if (fs.existsSync(appDirPath)) {
    appDirLocked = await checkIfDirectoryLocked(appDirPath);
    if (appDirLocked && !hasProcesses) {
      console.log(
        "⚠️ The app directory appears to be locked, but no Node.js processes were detected."
      );
      console.log(
        "   This could be due to other applications or system processes."
      );
    }
  }

  if (hasProcesses || appDirLocked) {
    // Customize message based on what we detected
    let message = "";
    if (hasProcesses && appDirLocked) {
      message =
        "⚠️ Running Node.js processes detected and app directory appears to be locked.\n";
    } else if (hasProcesses) {
      message =
        "⚠️ Running Node.js processes detected that might be locking files.\n";
    } else if (appDirLocked) {
      message = "⚠️ The app directory appears to be locked by some process.\n";
    }

    rl.question(
      message +
        "What would you like to do?\n" +
        "1. Continue anyway (may fail if files are locked)\n" +
        "2. Terminate Node.js processes automatically (recommended)\n" +
        "3. Cancel and exit\n" +
        "Enter option (1-3): ",
      async (answer) => {
        const option = answer.trim();
        if (option === "1") {
          askMoveOrDelete();
        } else if (option === "2") {
          if (platform === "win32") {
            const success = await terminateNodeProcesses();
            if (success) {
              console.log(
                "🔄 Continuing with reset after terminating processes..."
              );
              askMoveOrDelete();
            } else {
              rl.question(
                "⚠️ Some processes could not be terminated. Continue anyway? (y/N): ",
                (continueAnyway) => {
                  if (continueAnyway.trim().toLowerCase() === "y") {
                    askMoveOrDelete();
                  } else {
                    console.log(
                      "❌ Reset cancelled. Please close processes manually and try again."
                    );
                    rl.close();
                  }
                }
              );
            }
          } else {
            console.log(
              "❌ Automatic termination is only supported on Windows."
            );
            rl.question("Continue anyway? (y/N): ", (continueAnyway) => {
              if (continueAnyway.trim().toLowerCase() === "y") {
                askMoveOrDelete();
              } else {
                console.log(
                  "❌ Reset cancelled. Please close processes manually and try again."
                );
                rl.close();
              }
            });
          }
        } else {
          console.log(
            "❌ Reset cancelled. Please close running processes and try again."
          );
          rl.close();
        }
      }
    );
  } else {
    askMoveOrDelete();
  }
};

const askMoveOrDelete = () => {
  rl.question(
    "Do you want to move existing files to /app-example instead of deleting them? (Y/n): ",
    (answer) => {
      const userInput = answer.trim().toLowerCase() || "y";
      if (userInput === "y" || userInput === "n") {
        moveDirectories(userInput).finally(() => rl.close());
      } else {
        console.log("❌ Invalid input. Please enter 'Y' or 'N'.");
        rl.close();
      }
    }
  );
};

// Start the reset process
startReset();
