import React from 'react'
import { Box, Heading, Flex, Button, Link, LinkProps, ButtonProps } from '@chakra-ui/core'
import NextLink from 'next/link'

const MenuItem: React.FC<LinkProps> = ({ children, ...props }) => (
  <NextLink href={props.href!}>
    <Link mr={6} {...props}>
      {children}
    </Link>
  </NextLink>
)

const ButtonItem: React.FC<ButtonProps & {href?: string}> = ({children, ...props}) => (
  <NextLink href={props.href || '/'}>
    <Button variantColor="green" mr={2} size="sm" {...props}>
      {children}
    </Button>
  </NextLink>
)

export const Header: React.FC<{}> = (props) => {
  const handleToggle = () => {
    console.log('toggle')
  }

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      p={4}
      background="linear-gradient(to right, #6bb756f2, #008f68f2)"
      color="white"
      {...props}
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" size="lg" letterSpacing={'-.1rem'}>
          Postress
        </Heading>
      </Flex>

      <Box display={['block', 'none']} onClick={handleToggle}>
        <svg
          fill="white"
          width="12px"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </Box>

      <Box
        display={['none', 'flex']}
        width={['full', 'auto']}
        alignItems="center"
        flexGrow={1}
      >
        <MenuItem href="/">index</MenuItem>
        <MenuItem href="/login">login</MenuItem>
        <MenuItem href="/register">register</MenuItem>
      </Box>

      <Box display={['none', 'block']}>
        <ButtonItem href="/login">Login</ButtonItem>
        <ButtonItem href="/register">Create account</ButtonItem>
      </Box>
    </Flex>
  )
}
