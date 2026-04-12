import { Flex, Typography } from "@/components/Reusable-Components";

interface JobCardDetailsProps {
  experience: string;
  location: string;
  createdAt: string;
  experienceLabel: string;
  postedOnLabel: string;
}

export default function JobCardDetails({
  experience,
  location,
  createdAt,
  experienceLabel,
  postedOnLabel,
}: JobCardDetailsProps) {
  return (
    <Flex justify="start" align="start" orientation="vertical">
      <Flex justify="start">
        <i className="fa-solid fa-briefcase text-sm" />
        <Typography variant="small">
          {experienceLabel}: {experience}
        </Typography>
      </Flex>
      
      <Flex justify="start">
        <i className="fa-solid fa-location-dot text-sm" />
        <Typography variant="small">{location}</Typography>
      </Flex>

      <Flex justify="start">
        <i className="fa-solid fa-calendar text-sm" />
        <Typography variant="small">
          {postedOnLabel}: {new Date(createdAt).toLocaleDateString()}
        </Typography>
      </Flex>
    </Flex>
  );
}
