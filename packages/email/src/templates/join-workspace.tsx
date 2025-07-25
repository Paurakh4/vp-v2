import { Body } from "@react-email/body";
import { Button } from "@react-email/button";
import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Heading } from "@react-email/heading";
import { Hr } from "@react-email/hr";
import { Html } from "@react-email/html";
import { Link } from "@react-email/link";
import { Preview } from "@react-email/preview";
import { Text } from "@react-email/text";
import { env } from "next-runtime-env";
import * as React from "react";

export const JoinWorkspaceTemplate = ({
  magicLoginUrl,
}: {
  magicLoginUrl?: string;
}) => (
  <Html>
    <Head />
    <Preview>Log in with this magic link</Preview>
    <Body style={{ backgroundColor: "white" }}>
      <Container
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
          margin: "auto",
          paddingLeft: "0.75rem",
          paddingRight: "0.75rem",
        }}
      >
        <Heading
          style={{
            marginTop: "2.5rem",
            marginBottom: "2.5rem",
            fontSize: "24px",
            fontWeight: "bold",
            color: "#232323",
          }}
        >
          vibeplanify
        </Heading>
        <Heading
          style={{ fontSize: "24px", fontWeight: "bold", color: "#232323" }}
        >
          Login to your vibeplanify account
        </Heading>
        <Text
          style={{
            fontSize: "0.875rem",
            marginBottom: "2rem",
            color: "#232323",
          }}
        >
          Click the button below to instantly login to your account.
        </Text>
        <Button
          target="_blank"
          href={magicLoginUrl}
          style={{
            marginBottom: "2rem",
            borderRadius: "0.375rem",
            backgroundColor: "#282828",
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
            paddingTop: "1rem",
            paddingBottom: "1rem",
            fontSize: "0.875rem",
            fontWeight: "500",
            lineHeight: "1",
            color: "white",
          }}
        >
          Login to your account
        </Button>
        <Text
          style={{
            marginBottom: "1rem",
            fontSize: "0.875rem",
            color: "#7e7e7e",
          }}
        >
          If you didn&apos;t try to login, you can safely ignore this email.
        </Text>
        <Hr
          style={{
            marginTop: "2.5rem",
            marginBottom: "2rem",
            borderWidth: "1px",
          }}
        />
        <Text style={{ color: "#7e7e7e" }}>
          <Link
            href={env("NEXT_PUBLIC_BASE_URL")}
            target="_blank"
            style={{ color: "#7e7e7e", textDecoration: "underline" }}
          >
            vibeplanify
          </Link>
          , the open source Trello alternative.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default JoinWorkspaceTemplate;
