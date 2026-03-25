"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ActionCardProps = {
  title: string;
  sentence: string;
  buttonLabel: string;
  onAction: () => void;
  href?: never;
};

type ActionCardLinkProps = {
  title: string;
  sentence: string;
  buttonLabel: string;
  onAction?: never;
  href: string;
};

export function ActionCard(
  props: ActionCardProps | ActionCardLinkProps
) {
  const { title, sentence, buttonLabel } = props;

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div>
          <h2 className="font-display text-2xl text-foreground">{title}</h2>
          <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{sentence}</p>
        </div>
        {props.href ? (
          <Button render={<Link href={props.href} />} className="w-full">
            {buttonLabel}
          </Button>
        ) : (
          <Button type="button" onClick={props.onAction} className="w-full">
            {buttonLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
