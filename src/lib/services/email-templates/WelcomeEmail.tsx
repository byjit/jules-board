import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import { Logo } from "@/components/block/Logo";
import { APP_NAME } from "@/lib/constant";

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to {APP_NAME}</Preview>
    <Tailwind>
      <Body className="bg-white font-sans">
        <Container className="mx-auto p-4 max-w-2xl">
          <Section className="text-center mb-6">
            <Logo showText />
          </Section>

          <Section className="mt-8">
            <Heading className="text-2xl font-bold text-gray-900 p-0 my-8 mx-0">
              Welcome to {APP_NAME}, {name}!
            </Heading>
            <Text className="text-gray-700 text-sm leading-6">
              I&apos;m Jit, the creator of {APP_NAME}. We&apos;re thrilled to have you join our
              community. If you have any questions or need assistance, feel free to reach out.
            </Text>
          </Section>

          <Button
            className="bg-black text-white font-semibold py-3 px-6 rounded-md text-sm no-underline text-center"
            href="https://calendly.com/rely-prasanjit/30min"
          >
            Book a Call
          </Button>

          <Hr className="border border-solid border-[#eaeaea] my-6 w-full" />

          <Text className="text-gray-400 text-xs leading-5">
            You received this email because you signed up for {APP_NAME}. If you believe this was a
            mistake, please ignore this email.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default WelcomeEmail;
