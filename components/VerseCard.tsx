"use client"

import { Card } from '@/components/ui/card';

interface VerseCardProps {
  title: string;
  verse: string;
  verseRef: string;
  readyContent?: string;
  setContent?: string;
  goContent?: string;
  reflectionQuestions?: string[];
}

export function VerseCard({
  title,
  verse,
  verseRef,
  readyContent,
  setContent,
  goContent,
  reflectionQuestions
}: VerseCardProps) {
  return (
    <Card className="p-6 mb-8 w-full">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      
      <div className="prose max-w-none">
        <blockquote className="text-2xl italic border-l-4 border-primary pl-4 my-6">
          {verse}
          <footer className="text-lg mt-2">{verseRef}</footer>
        </blockquote>

        {readyContent && (
          <>
            <h2 className="text-2xl font-bold mt-8 mb-4">READY</h2>
            <p className="text-lg mb-6">{readyContent}</p>
          </>
        )}

        {setContent && (
          <>
            <h2 className="text-2xl font-bold mt-8 mb-4">SET</h2>
            <div dangerouslySetInnerHTML={{ __html: setContent }} />
          </>
        )}

        {goContent && (
          <>
            <h2 className="text-2xl font-bold mt-8 mb-4">GO</h2>
            <div dangerouslySetInnerHTML={{ __html: goContent }} />
          </>
        )}

        {reflectionQuestions && reflectionQuestions.length > 0 && (
          <div className="bg-muted p-6 rounded-lg mt-8">
            <h3 className="text-xl font-bold mb-4">Reflection Questions</h3>
            <ul className="space-y-4">
              {reflectionQuestions.map((question, i) => (
                <li key={i}>{question}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
