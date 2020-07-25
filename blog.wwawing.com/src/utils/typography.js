import Typography from "typography"
import Bootstrap from "typography-theme-bootstrap"

Bootstrap.overrideThemeStyles = ({ rhythm }) => ({
  "a:link": {
    color: `#337ab7`,
    textDecoration: `none`,
  },
  "a:visited": {
    color: `#337ab7`,
  },
  "a:hover": {
    textDecoration: `underline`,
  },
  "p": {
    marginTop: 0,
    marginBottom: rhythm(0.7)
  }
})

const typography = new Typography(Bootstrap)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
