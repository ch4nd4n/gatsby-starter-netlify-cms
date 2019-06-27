import React from "react";
import { graphql, Link } from "gatsby";
import { Helmet } from "react-helmet";
import BlogRoll from "../components/BlogRoll";

import logo from "../../static/img/ck-logo-cur.svg";

import {
  Container,
  Content,
  Header,
  Hero,
  Section
} from "../components/base-elements";

export default function Template({
  data // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data; // data.markdownRemark holds our post data
  const { frontmatter } = markdownRemark;
  return (
    <Container>
      <Helmet>
        <title>{frontmatter.title}</title>
      </Helmet>
      <Header>
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </Header>
      <Content>
        <Hero>
          <h1>{frontmatter.heading}</h1>
        </Hero>
        <Section>
          <h2>All stories</h2>
          <BlogRoll />
        </Section>
      </Content>
    </Container>
  );
}

export const pageQuery = graphql`
  query Template {
    markdownRemark(frontmatter: { templateKey: { eq: "index-minima-page" } }) {
      html
      frontmatter {
        title
        heading
      }
    }
  }
`;
