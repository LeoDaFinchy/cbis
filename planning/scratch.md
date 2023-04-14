# Storing in a stockpile

## Requirements

- Boi
- Item to be stored
- Storage Area
  - Empty space

## Sequence

### Proactive Activities

- Item left lying around
- Foreman detects item
- Foreman finds valid storage space
- Foreman creates work order
  - Reserves storage space
  - Reserves item
- Boi is idle
- Boi looks for work
- Foreman assigns work order
- Boi finds path to item
- Boi navigates to item
- Boi picks up item
- Boi finds path to storage space
- Boi navigates to storage space
- Boi stores item

### On-request Activities
- Boi is idle
- Boi looks for work
- Foreman notified of idle Boi
- Foreman looks for loose item
- Foreman finds valid storage space
- Foreman creates work order
  - Reserves so
- **THIS IS BOLLOCKS**