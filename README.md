# Clean Data XMLs
Clean Data XMLs is a JavaScript command-line application designed to clean CHILI publish resource data XML files from missing entries typically caused by manually deleting files on a CHILI publish server.

This is only designed for resource data XML files, and should not be used on non-file type (settings) data XML files. Thus this should be used for:
* Documents
* Assets
* Fonts
* Workspaces
* ViewPreferences
* ThreeDModels
* FoldSettings

## Usage
The command-line application is meant to be ran on the CHILI publish server. The user running the application will need read/write permission over the CHILI publish data folder.

Download the latest release from the github page.

Unzip your release, and find the clean-data-xmls.exe executable.

❗It is strongly suggested to run this when all your CHILI Web App and Service is off❗

Failure to do so could mean file collision and application failure. In addition, antivirus may also conflict with this application. Your other option is to copy your data XML files to another directory and utilize the *--source* and *--resource-directory* commands with *clean*.


### Commands

**help** <br/>
At an time run the --help option command  get a detailed list of commands and options
```
clean-data-xmls.exe --help
```

**clean** <br/>
The *clean* command is used to process a folder of data XML files with a number of options. The *clean* command requires a *--source* option argument pointing to the directory of the folder containing the data XML files.

So for example, if you wanted to clean your Documents folder found on on the server path `C:\chili_data\Resources\Documents`, the command you would use is:
```
clean-data-xmls.exe clean -s "C:\chili_data\Resources\Documents"
```

<br/>
This command would process through all data XML files found in the Documents folder, check to see if the each item actually exist, and then modify the XML file if the document is missing.

This command will overwrite the data XMLs
<br/>
<br/>

Below is a table of options for the *clean* command 
<br/><br/>

| Options | Flag | Required | Description |
| ----------- | ----------- | ----------- | ----------- |
| source | -s --source | Yes | Source of the data XMLs |
|resource directory| -r --resource-directory| No | Source of the resource files for the data XMLs - defaults to --source value |
| output | -o --output | No | Output directory of the data XMLs after being modified - defaults to --source value|
| process amount | -p --process-amount | No | Number of data XMLs to process at the same time - defaults to 10 |

<br/>

If you did not want to overwrite the original data XML files, you would run the following command to output the modified data XML files to another folder:
```
clean-data-xmls.exe clean -s "C:\chili_data\Resources\Documents" -o "C:\chili_data\Modified_Data\Documents"
```
It is very important the output folder already exists otherwise you will receive and error.

<br/>

**fake** <br/>
The *fake* command is meant to be used of testing. This command will take the data XML files at the required *--source* argument and create a folder/file structure from the XMLs in the required *--output* argument.

You can also include the *--skip-files* argument to replicate missing files.

Below is a table of options for the *clean* command 
<br/><br/>

| Options | Flag | Required | Description |
| ----------- | ----------- | ----------- | ----------- |
| source | -s --source | Yes | Source of data XMLs |
| output | -o --output | No | Output location of fake files |
| process amount | -p --process-amount | No | Purposefully skip files - defaults to false |

<br/>
If you wanted to create a test folder of folder and files for your data XMLs, but wanted to make sure some files were missing, you can use the following command:

```
clean-data-xmls.exe fake -s "C:\chili_data\Resources\Documents" -o "C:\chili_data\Fake_Resources\Documents"
```
<br/>

## Build
This project uses [Nexe](https://github.com/nexe/nexe) to compile Node 14 into a command-line application.

To build this project, you need to follow the directions on [Nexe](https://github.com/nexe/nexe) to make sure you have the requirements for building Node.js. 

Since most likely you will be building on Windows, the best way meet these requirements is on a fresh Windows 10 install, install VS Studio Community Edition, install Node 14 and choose yes to install requirements for building node, and then manually install [NASM](https://www.nasm.us/).

Once the requirements are installed, you can then fork this project and run the following commands in order:
```
npm run install
```
```
npm run build
```