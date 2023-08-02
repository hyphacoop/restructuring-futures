export default function splitTitleAndNotes(text) {
    let title = '';
    let notes = '';
  
    // First, split the text at '#Title:'
    const titleSplit = text.split('#Title:');
  
    // If there's a second part, then '#Title:' was present
    if (titleSplit[1] !== undefined) {
      // Now split the second part at '#Notes:'
      const notesSplit = titleSplit[1].split('#Notes:');
  
      // The first part of this split is the title
      title = notesSplit[0].trim();
  
      // If there's a second part, then '#Notes:' was present
      if (notesSplit[1] !== undefined) {
        // The second part of this split is the notes
        notes = notesSplit[1].trim();
      }
    }
  
    return {
      title: title,
      notes: notes
    };
  }