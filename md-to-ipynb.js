#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Check if filename is provided
if (process.argv.length < 3) {
  console.error('Usage: node md-to-ipynb.js <markdown-file> [output-file]');
  process.exit(1);
}

// Get input and output filenames
const inputFile = process.argv[2];
const outputFile = process.argv.length > 3 
  ? process.argv[3] 
  : inputFile.replace(/\.md$/, '.ipynb');

// Check if input file exists
if (!fs.existsSync(inputFile)) {
  console.error(`Error: File '${inputFile}' does not exist.`);
  process.exit(1);
}

// Read the markdown content
const markdownContent = fs.readFileSync(inputFile, 'utf8');

// Split the markdown into cells based on headers and code blocks
function splitIntoNotebookCells(markdown) {
  const cells = [];
  let currentCell = '';
  let inCodeBlock = false;
  let codeBlockLang = '';
  
  // Split the markdown into lines
  const lines = markdown.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for code block markers
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        // Start of a code block
        if (currentCell.trim()) {
          // Save the current markdown cell if it has content
          cells.push({
            cell_type: 'markdown',
            metadata: {},
            source: currentCell.split('\n').map(line => line + '\n')
          });
          currentCell = '';
        }
        
        // Extract the language if specified
        codeBlockLang = line.slice(3).trim();
        inCodeBlock = true;
        
        // Skip this line (the opening ```)
        continue;
      } else {
        // End of a code block
        inCodeBlock = false;
        
        // Determine cell type based on language
        const cellType = codeBlockLang === 'python' ? 'code' : 'markdown';
        
        if (cellType === 'code') {
          cells.push({
            cell_type: 'code',
            execution_count: null,
            metadata: {
              tags: []
            },
            outputs: [],
            source: currentCell.split('\n').map(line => line + '\n')
          });
        } else {
          // For non-python code blocks, keep them as markdown with the code formatting
          cells.push({
            cell_type: 'markdown',
            metadata: {},
            source: ['```' + codeBlockLang + '\n', ...currentCell.split('\n').map(line => line + '\n'), '```\n']
          });
        }
        
        currentCell = '';
        continue;
      }
    }
    
    // Check for headers (only if not in a code block)
    if (!inCodeBlock && line.startsWith('#')) {
      // If we have content in the current cell, save it
      if (currentCell.trim()) {
        cells.push({
          cell_type: 'markdown',
          metadata: {},
          source: currentCell.split('\n').map(line => line + '\n')
        });
        currentCell = '';
      }
      
      // Start a new cell with this header
      currentCell = line + '\n';
      continue;
    }
    
    // Add the line to the current cell
    currentCell += line + '\n';
  }
  
  // Add the last cell if there's content
  if (currentCell.trim()) {
    cells.push({
      cell_type: 'markdown',
      metadata: {},
      source: currentCell.split('\n').map(line => line + '\n')
    });
  }
  
  return cells;
}

// Create the notebook structure
const notebookCells = splitIntoNotebookCells(markdownContent);
const notebook = {
  cells: notebookCells,
  metadata: {
    kernelspec: {
      display_name: 'Python 3',
      language: 'python',
      name: 'python3'
    },
    language_info: {
      codemirror_mode: {
        name: 'ipython',
        version: 3
      },
      file_extension: '.py',
      mimetype: 'text/x-python',
      name: 'python',
      nbconvert_exporter: 'python',
      pygments_lexer: 'ipython3',
      version: '3.8.0'
    }
  },
  nbformat: 4,
  nbformat_minor: 4
};

// Write the notebook to the output file
fs.writeFileSync(outputFile, JSON.stringify(notebook, null, 2));

console.log(`Successfully converted '${inputFile}' to '${outputFile}'`); 