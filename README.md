🤖 AI Code Reviewer Agent

An AI-powered code review agent built with Node.js, JavaScript, and Google Gemini. It uses AI reasoning and function-calling tools to inspect source files, identify potential code issues, and perform file operations based on the model's decisions.

🚀 Overview

The AI Code Reviewer Agent is a command-line application that takes a project directory as input, discovers supported source files, reads their contents, and uses Google Gemini to analyze the code.

The agent can interact with the file system through custom tools, enabling it to read files and write changes when requested by the model.

✨ Features

Automated File Discovery: Scans a target directory for supported source files.

AI-Powered Code Analysis: Uses Google Gemini to review source code.

Function Calling: Allows the model to request file operations through predefined tools.

File Reading: Reads source files for analysis.

File Writing: Writes changes through the write_file tool when requested.

Command-Line Interface: Runs directly from the terminal.

Error Handling: Handles API errors and can retry supported temporary failures, depending on the configured retry logic.

EnvironmentRuntime: Node.js

Language: JavaScript (ES Modules)

AI Model: Google Gemini

AI SDK: @google/genai

File System: Node.js fs and path

Environment Configuration: dotenv

⚙️ How It Works

The user provides the target project directory.

The agent discovers supported files such as JavaScript, TypeScript, HTML, CSS, and JSX files.

The agent reads file contents using its file-reading tool.

The contents and instructions are sent to Google Gemini.

Gemini analyzes the code and can request available tool operations.

The agent executes supported tool calls and returns their results to the model.

The process continues until the agent finishes or reaches its iteration limit. Variables: Keeps API credentials outside the source code.
