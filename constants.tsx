
import React from 'react';
import { ClassLevel, Difficulty, Board, IntermediateGroup, BTechCourse, UserProfile } from './types';

export const CLASSES: ClassLevel[] = [
  ClassLevel.CLASS_6, ClassLevel.CLASS_7, ClassLevel.CLASS_8, ClassLevel.CLASS_9, ClassLevel.CLASS_10,
  ClassLevel.INTERMEDIATE, ClassLevel.BTECH
];

export const BOARDS: Board[] = ['CBSE', 'CISCE', 'SSC'];
export const GROUPS: IntermediateGroup[] = ['MPC', 'BiPC', 'MBiPC'];
export const COURSES: BTechCourse[] = ['CSE', 'ECE', 'AI & ML', 'AI', 'EEE', 'CIVIL'];
export const DIFFICULTIES: Difficulty[] = [Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD];

export const AVATARS = [
  "🤖", "👾", "🦊", "🚀", "🌟", "🛡️", "🧬", "🧠", 
  "🦒", "🐼", "🦉", "🦁", "🐢", "🦄", "🌈", "🔥", 
  "⚽", "🎨", "🎭", "🎮", "🛰️", "🛸", "🔋", "💻",
  "⚡", "🪐", "🍎", "🏀", "🎸", "🎧", "📷", "📽️"
];

export const getSubjectsForProfile = (profile: Partial<UserProfile>): string[] => {
  if (!profile.classLevel) return [];

  const subjects = ['English'];
  
  const is6to8 = [ClassLevel.CLASS_6, ClassLevel.CLASS_7, ClassLevel.CLASS_8].includes(profile.classLevel as ClassLevel);
  const is9to10 = [ClassLevel.CLASS_9, ClassLevel.CLASS_10].includes(profile.classLevel as ClassLevel);

  if (is6to8) {
    subjects.push('Mathematics', 'Science', 'Social Science', 'Hindi', 'Sanskrit');
    return subjects;
  }

  if (is9to10) {
    subjects.push('Mathematics', 'Science', 'Social Science');
    if (profile.secondLanguage) subjects.push(profile.secondLanguage);
    return subjects;
  }

  if (profile.classLevel === ClassLevel.INTERMEDIATE) {
    if (profile.group === 'MPC') subjects.push('Maths 1A/B', 'Maths 2A/B', 'Physics', 'Chemistry');
    else if (profile.group === 'BiPC') subjects.push('Botany', 'Zoology', 'Physics', 'Chemistry');
    else if (profile.group === 'MBiPC') subjects.push('Maths', 'Biology', 'Physics', 'Chemistry');
    if (profile.secondLanguage) subjects.push(profile.secondLanguage);
    return subjects;
  }

  if (profile.classLevel === ClassLevel.BTECH) {
    switch (profile.course) {
      case 'CSE': subjects.push('Data Structures', 'Algorithms', 'OS', 'DBMS', 'Networks'); break;
      case 'ECE': 
        subjects.push(
          'EG',
          'MATHEMATICS',
          'PHYSICS',
          'CHEMISTRY',
          'GRAPHICS',
          'Signals & Systems', 
          'Microprocessors', 
          'Digital Comm'
        ); 
        break;
      case 'AI & ML': subjects.push('Python', 'ML', 'Linear Algebra', 'Neural Networks'); break;
      case 'AI': subjects.push('AI Basics', 'NLP', 'Deep Learning', 'Robotics'); break;
      case 'EEE': subjects.push('Power Systems', 'Machines', 'Control Systems'); break;
      case 'CIVIL': subjects.push('Structures', 'Fluids', 'Geotechnical'); break;
      default: subjects.push('Eng. Mathematics', 'Applied Physics', 'C Programming');
    }
  }

  return subjects;
};

export const Icons = {
  Robot: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
  ),
  Send: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
  ),
  ChevronRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  ),
  Home: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ),
  Chat: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
  ),
  Quiz: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
  ),
  History: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  Edit: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
  ),
  X: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  ),
  Camera: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
  ),
  Image: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
  )
};
