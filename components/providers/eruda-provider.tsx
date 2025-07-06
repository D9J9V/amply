'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

const Eruda = dynamic(
  () =>
    import('eruda').then((eruda) => {
      if (typeof window !== 'undefined') {
        eruda.default.init();
      }
      return () => null;
    }),
  { ssr: false }
);

export const ErudaProvider = (props: { children: ReactNode }) => {
  if (process.env.NODE_ENV === 'production') {
    return <>{props.children}</>;
  }
  return (
    <>
      <Eruda />
      {props.children}
    </>
  );
};