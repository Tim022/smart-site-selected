import React from 'react'
import styles from './icons.module.css'

export const SearchIcon = ({
  size = 24, // or any default size of your choice
  color = "black", // or any color of your choice
  innerStyle
}) => {
  return (
    <span role='img' className={styles.iconDisplay} aria-label='search' style={innerStyle}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        width={size} // added size here
        height={size} // added size here
        fill={color} // added color here
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <g clipPath="url(#clip0_257_2982)">
          <path d="M15.0983 14.1183L10.4608 9.4808C11.1805 8.55045 11.5698 7.41295 11.5698 6.21652C11.5698 4.78438 11.0108 3.44152 10.0001 2.42902C8.9894 1.41652 7.64297 0.859375 6.21261 0.859375C4.78225 0.859375 3.43583 1.4183 2.42511 2.42902C1.41261 3.43973 0.855469 4.78438 0.855469 6.21652C0.855469 7.64688 1.4144 8.9933 2.42511 10.004C3.43583 11.0165 4.78047 11.5737 6.21261 11.5737C7.40904 11.5737 8.54475 11.1844 9.47511 10.4665L14.1126 15.1022C14.1262 15.1158 14.1424 15.1266 14.1601 15.134C14.1779 15.1414 14.1969 15.1452 14.2162 15.1452C14.2354 15.1452 14.2545 15.1414 14.2722 15.134C14.29 15.1266 14.3062 15.1158 14.3198 15.1022L15.0983 14.3254C15.1119 14.3118 15.1227 14.2957 15.1301 14.2779C15.1375 14.2602 15.1412 14.2411 15.1412 14.2219C15.1412 14.2026 15.1375 14.1836 15.1301 14.1658C15.1227 14.148 15.1119 14.1319 15.0983 14.1183ZM9.04118 9.04509C8.28404 9.80045 7.28047 10.2165 6.21261 10.2165C5.14475 10.2165 4.14118 9.80045 3.38404 9.04509C2.62868 8.28795 2.21261 7.28438 2.21261 6.21652C2.21261 5.14866 2.62868 4.1433 3.38404 3.38795C4.14118 2.63259 5.14475 2.21652 6.21261 2.21652C7.28047 2.21652 8.28583 2.6308 9.04118 3.38795C9.79654 4.14509 10.2126 5.14866 10.2126 6.21652C10.2126 7.28438 9.79654 8.28973 9.04118 9.04509Z" />
        </g>
        <defs>
          <clipPath id="clip0_257_2982">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </span>
  )
}

export const CloseIcon = ({
  size = 24, // or any default size of your choice
  color = "black", // or any color of your choice
  innerStyle
}) => {
  return (
    <span role='img' className={styles.iconDisplay} aria-label='close' style={innerStyle}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size} // added size here
        height={size} // added size here
        fill={color} // added color here
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M13.3866 11.9987L20.4178 3.61749C20.5357 3.47821 20.4366 3.2666 20.2545 3.2666H18.117C17.9911 3.2666 17.8705 3.32285 17.7875 3.41928L11.9884 10.3327L6.18928 3.41928C6.10892 3.32285 5.98838 3.2666 5.85981 3.2666H3.72231C3.54017 3.2666 3.44106 3.47821 3.55892 3.61749L10.5902 11.9987L3.55892 20.38C3.53252 20.411 3.51558 20.449 3.51012 20.4894C3.50465 20.5298 3.5109 20.5709 3.5281 20.6078C3.5453 20.6448 3.57275 20.676 3.60717 20.6978C3.6416 20.7196 3.68156 20.7311 3.72231 20.7309H5.85981C5.98571 20.7309 6.10624 20.6746 6.18928 20.5782L11.9884 13.6648L17.7875 20.5782C17.8678 20.6746 17.9884 20.7309 18.117 20.7309H20.2545C20.4366 20.7309 20.5357 20.5193 20.4178 20.38L13.3866 11.9987Z" />
      </svg>
    </span>
  )
}

export const InfoCircleIcon = ({
  size = 24, // or any default size of your choice
  color = "black", // or any color of your choice
  innerStyle
}) => {
  return (
    <span role='img' className={styles.iconDisplay} aria-label='info-circle' style={innerStyle}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size} // added size here
        height={size} // added size here
        fill={color} // added color here
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M2 12C2 6.486 6.486 2 12 2C17.514 2 22 6.486 22 12C22 17.514 17.514 22 12 22C6.486 22 2 17.514 2 12ZM4 12C4 16.411 7.589 20 12 20C16.411 20 20 16.411 20 12C20 7.589 16.411 4 12 4C7.589 4 4 7.589 4 12ZM13 17V11H11V17H13ZM13 9V7H11V9H13Z" />
      </svg>
    </span>
  )
}

export const ChevronLeftIcon = ({
  size = 24, // or any default size of your choice
  color = "black", // or any color of your choice
  innerStyle
}) => {
  return (
    <span role='img' className={styles.iconDisplay} aria-label='chevron-left' style={innerStyle}>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        width={size} // added size here
        height={size} // added size here
        fill={color} // added color here
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M14.7325 3.44369V1.71824C14.7325 1.56869 14.5606 1.4861 14.4445 1.57761L4.38201 9.43699C4.29651 9.50348 4.22733 9.58861 4.17975 9.6859C4.13216 9.78319 4.10742 9.89007 4.10742 9.99837C4.10742 10.1067 4.13216 10.2136 4.17975 10.3108C4.22733 10.4081 4.29651 10.4933 4.38201 10.5598L14.4445 18.4191C14.5628 18.5107 14.7325 18.4281 14.7325 18.2785V16.5531C14.7325 16.4437 14.6811 16.3388 14.5963 16.2718L6.56058 9.99949L14.5963 3.72494C14.6811 3.65797 14.7325 3.55306 14.7325 3.44369Z" />
      </svg>

    </span>
  )
}

export default function None() {
  return (<></>)
}