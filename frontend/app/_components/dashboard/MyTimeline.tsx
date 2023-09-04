import { Timeline } from "@primer/react";
import { HiMiniTrophy, HiUserPlus } from "react-icons/hi2";

export const MyTimeline = () => {
  return (
    <Timeline>
      <Timeline.Item>
        <Timeline.Badge>
          <HiUserPlus />
        </Timeline.Badge>
        <Timeline.Body>You recieved a trophy!</Timeline.Body>
      </Timeline.Item>

      <Timeline.Item>
        <Timeline.Badge>
          <HiMiniTrophy />
        </Timeline.Badge>
        <Timeline.Body>You joined</Timeline.Body>
      </Timeline.Item>
    </Timeline>
  );
};
