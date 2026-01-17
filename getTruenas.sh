#!/bin/bash

# --- CONFIGURATION ---

API_KEY="1-H7n1uPciKwDDeOK6SZeID8UuLxTrzLglYCMnmUMehdtePfs9jTFDUcwc6EPF3Ymg"

# --- EXECUTION ---
# We use curl to get the data and 'jq' to parse it for readability
response=$(curl -s -X GET "https://truenas.duylong.art/api/v2.0/pool" \
     -H "Authorization: Bearer $API_KEY" \
     -H "Content-Type: application/json")

# Check if curl succeeded
if [ $? -ne 0 ]; then
    echo "Error: Could not connect to TrueNAS at $TRUENAS_IP"
    exit 1
fi

# --- OUTPUT ---
echo "------------------------------------------"
echo "TRUENAS STORAGE REMAINDER REPORT"
echo "------------------------------------------"

# This parses the JSON and prints a clean list for every pool found
echo "$response" | jq -r '.[] | 
    "Pool Name:  " + .name + 
    "\nStatus:     " + .status +
    "\nTotal Size: " + .size_str + 
    "\nAllocated:  " + .allocated_str + 
    "\nRemainder:  " + .free_str + 
    "\n------------------------------------------"'