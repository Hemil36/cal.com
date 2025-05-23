import type z from "zod";

import type { GetAppData, SetAppData } from "@calcom/app-store/EventTypeAppContext";
import EventTypeAppContext from "@calcom/app-store/EventTypeAppContext";
import { EventTypeAddonMap } from "@calcom/app-store/apps.browser.generated";
import type { EventTypeMetaDataSchema } from "@calcom/prisma/zod-utils";
import type { RouterOutputs } from "@calcom/trpc/react";
import { ErrorBoundary } from "@calcom/ui/components/errorBoundary";

import type { EventTypeAppCardComponentProps, CredentialOwner } from "../types";
import { DynamicComponent } from "./DynamicComponent";

export type EventTypeApp = RouterOutputs["viewer"]["apps"]["integrations"]["items"][number] & {
  credentialOwner?: CredentialOwner;
};

export type EventTypeForAppCard = EventTypeAppCardComponentProps["eventType"];

export const EventTypeAppCard = (props: {
  app: EventTypeApp;
  eventType: EventTypeForAppCard;
  getAppData: GetAppData;
  setAppData: SetAppData;
  // For event type apps, get these props from shouldLockDisableProps
  LockedIcon?: JSX.Element | false;
  eventTypeFormMetadata: z.infer<typeof EventTypeMetaDataSchema>;
  disabled?: boolean;
}) => {
  const { app, getAppData, setAppData, LockedIcon, disabled } = props;
  return (
    <ErrorBoundary message={`There is some problem with ${app.name} App`}>
      <EventTypeAppContext.Provider value={{ getAppData, setAppData, LockedIcon, disabled }}>
        <DynamicComponent
          slug={app.slug === "stripe" ? "stripepayment" : app.slug}
          componentMap={EventTypeAddonMap}
          {...props}
        />
      </EventTypeAppContext.Provider>
    </ErrorBoundary>
  );
};
