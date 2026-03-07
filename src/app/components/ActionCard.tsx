"use client";

import { PrimaryButton } from "./ui";

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
    <div className="flex flex-col gap-5 rounded-3xl glass p-5">
      <div>
        <h2 className="text-[24px] font-medium tracking-tight text-white">
          {title}
        </h2>
        <p className="mt-1 text-[17px] leading-[1.5] text-muted">
          {sentence}
        </p>
      </div>
      {props.href ? (
        <PrimaryButton href={props.href} className="w-full">
          {buttonLabel}
        </PrimaryButton>
      ) : (
        <PrimaryButton
          type="button"
          onClick={props.onAction}
          className="w-full"
        >
          {buttonLabel}
        </PrimaryButton>
      )}
    </div>
  );
}
