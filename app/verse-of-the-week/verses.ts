// Verse data for the Verse of the Week feature
export const verses = [
  {
    id: "to-little-children",
    title: "God's Glory Revealed: To Little Children",
    verse: "I thank you, Father, Lord of heaven and earth, that You have hidden these things from the wise and understanding and revealed them to little children.",
    reference: "Matthew 11:25 (ESV)",
    date: "April 22, 2025"
  },
  {
    id: "providence",
    title: "God's Glory Revealed: Providence",
    verse: "And my God will meet all your needs according to the riches of His glory in Christ Jesus.",
    reference: "Philippians 4:19",
    date: "April 15, 2025"
  },
  {
    id: "running-on-tired-legs",
    title: "God's Glory Revealed: Running on Tired Legs",
    verse: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
    reference: "Isaiah 40:31",
    date: "April 8, 2025"
  },
  {
    id: "power-of-his-presence",
    title: "God's Glory Revealed: The Power of His Presence",
    verse: "Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you, I will uphold you with my righteous right hand.",
    reference: "Isaiah 41:10",
    date: "April 1, 2025"
  }
];

// Function to parse date strings into Date objects
export const parseVerseDate = (dateStr: string) => {
  const [month, day, year] = dateStr.split(/[\s,]+/);
  const months = ["January", "February", "March", "April", "May", "June", 
                 "July", "August", "September", "October", "November", "December"];
  return new Date(parseInt(year), months.indexOf(month), parseInt(day));
};
