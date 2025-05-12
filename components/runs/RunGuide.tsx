"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export function RunGuide() {
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">R.U.N Guide</h3>
      <ScrollArea className="h-[400px] pr-4">
        <div className="grid gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">R.EFLECT</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">Read and Reflect on a Bible verse</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">U.NDERSTAND</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">Understand the core message God is trying to speak to you through this verse</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">N.AVIGATE</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">Navigate your next steps & how you can apply what God has spoken to you</p>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
