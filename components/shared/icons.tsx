import React from 'react';

export const SimpleMaleIcon: React.FC<{ className?: string; title?: string }> = ({ className, title }) => (
  <svg viewBox="0 0 24 24" className={`w-4 h-4 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden={!title} role={title ? "img" : "presentation"}>
    {title && <title>{title}</title>}
    <circle cx="12" cy="12" r="9" fill="#60A5FA"/> {/* Tailwind blue-400 */}
  </svg>
);

export const SimpleFemaleIcon: React.FC<{ className?: string; title?: string }> = ({ className, title }) => (
  <svg viewBox="0 0 24 24" className={`w-4 h-4 ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden={!title} role={title ? "img" : "presentation"}>
    {title && <title>{title}</title>}
    <circle cx="12" cy="12" r="9" fill="#F472B6"/> {/* Tailwind pink-400 */}
  </svg>
);

export const HeartIcon: React.FC<{ className?: string; title?: string }> = ({ className, title }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${className}`} aria-hidden={!title} role={title ? "img" : "presentation"}>
    {title && <title>{title}</title>}
    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.218l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
  </svg>
);

export const UsersIcon: React.FC<{ className?: string; title?: string }> = ({ className, title }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${className}`} aria-hidden={!title} role={title ? "img" : "presentation"}>
    {title && <title>{title}</title>}
    <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 1-3.742 2.565C14.796 23.088 16.005 24 17.25 24a2.75 2.75 0 0 0 2.75-2.75c0-1.526-1.228-2.75-2.75-2.75Z" />
  </svg>
);

export const SkullIcon: React.FC<{ className?: string; title?: string }> = ({ className, title }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${className}`} aria-hidden={!title} role={title ? "img" : "presentation"}>
    {title && <title>{title}</title>}
    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
    <path d="M14.5 7c-.827 0-1.5.673-1.5 1.5S13.673 10 14.5 10s1.5-.673 1.5-1.5S15.327 7 14.5 7zM9.5 7c-.827 0-1.5.673-1.5 1.5S8.673 10 9.5 10s1.5-.673 1.5-1.5S10.327 7 9.5 7z"/>
    <path d="M12 12c-2.385 0-4.418 1.097-5.781 2.75-.168.204-.113.513.116.646.189.109.429.07.571-.08C8.111 14.039 9.933 13.5 12 13.5s3.889.539 5.094 1.816c.142.15.382.189.571.08.229-.133.284-.442.116-.646C16.418 13.097 14.385 12 12 12z"/>
  </svg>
);

export const CrownIcon: React.FC<{ className?: string; title?: string }> = ({ className, title }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${className}`} aria-hidden={!title} role={title ? "img" : "presentation"}>
    {title && <title>{title}</title>}
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.129c1.454-1.272 3.792-1.272 5.247 0a.75.75 0 0 1-.989 1.13ZM12 6a.75.75 0 0 1 .75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 1 .75.75v.008c0 .414.336.75.75.75H15a.75.75 0 0 1 .75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 1 .75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 1 0 1.5h-.008a.75.75 0 0 1-.75-.75v-.008a.75.75 0 0 1-.75-.75h-.008a.75.75 0 0 1-.75-.75v-.008a.75.75 0 0 1-.75-.75H15a.75.75 0 0 1-.75-.75v-.008a.75.75 0 0 1-.75-.75H12a.75.75 0 0 1-.75-.75V6.75A.75.75 0 0 1 12 6Zm-2.25 7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
  </svg>
);

export const LinkIcon: React.FC<{ className?: string; title?: string }> = ({ className, title }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${className}`} aria-hidden={!title} role={title ? "img" : "presentation"}>
    {title && <title>{title}</title>}
    <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

export const ExcommunicationIcon: React.FC<{ className?: string; title?: string }> = ({ className, title }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${className}`} aria-hidden={!title} role={title ? "img" : "presentation"}>
    {title && <title>{title}</title>}
    <path fillRule="evenodd" d="M2.273 5.625A10.47 10.47 0 0 0 1.5 9.75a.75.75 0 0 0 1.5 0 8.97 8.97 0 0 1 .656-3.393.75.75 0 0 0-1.383-.532ZM21.727 5.625a.75.75 0 0 0-1.383.532 8.97 8.97 0 0 1 .656 3.393.75.75 0 0 0 1.5 0 10.47 10.47 0 0 0-.773-4.125ZM12 3a.75.75 0 0 0-.75.75v.099A9.028 9.028 0 0 0 9.375 3a.75.75 0 0 0 0 1.5c.239 0 .471.018.7.051V13.5H9a.75.75 0 0 0 0 1.5h1.5V18a.75.75 0 0 0 1.5 0v-3h1.5a.75.75 0 0 0 0-1.5H12V4.551a8.96 8.96 0 0 1 .925-.05V3.75A.75.75 0 0 0 12 3ZM5.462 4.152a.75.75 0 0 0-1.015.31L2.55 8.21a.75.75 0 0 0 .92.98L5.52 7.836a.75.75 0 0 0-.058-1.24l-1.44-1.072a3.285 3.285 0 0 1-.02-.015.75.75 0 1 0-.52.628l.004.003.002.001h.002l.002.001.006.003a1.07 1.07 0 0 0 .05.022l1.44 1.073a2.25 2.25 0 0 1 .174 3.72L2.25 16.5v.75c0 .414.336.75.75.75H6v3.75a.75.75 0 0 0 1.5 0V18h9v3.75a.75.75 0 0 0 1.5 0V18h2.25a.75.75 0 0 0 .75-.75V16.5l-3.87-2.902a2.25 2.25 0 0 1 .175-3.72l1.44-1.073.05-.038c.01-.007.02-.015.03-.023l.006-.004.001-.001a.75.75 0 1 0-.54-.62L19.98 5.494a.75.75 0 0 0-1.015-.31l-1.897 1.138-3.57-6.346a.75.75 0 0 0-1.325-.001L8.457 6.282 6.56 5.145a.75.75 0 0 0-1.098 1.012l1.138 1.897L5.462 4.152Zm14.813 11.774L18 13.875v-1.51l2.275-1.706Z" clipRule="evenodd" />
    <path d="M3.383 18.012 7.133 21h9.734l3.75-2.988H3.383z" fillOpacity="0.5" />
    <line x1="4" y1="20" x2="20" y2="4" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const PlayIcon: React.FC<{ className?: string; title?: string }> = ({ className, title }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${className}`} aria-hidden={!title} role={title ? "img" : "presentation"}>
    {title && <title>{title}</title>}
    <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
  </svg>
);

export const PauseIcon: React.FC<{ className?: string; title?: string }> = ({ className, title }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${className}`} aria-hidden={!title} role={title ? "img" : "presentation"}>
    {title && <title>{title}</title>}
    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75.75V18a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm10.5 0a.75.75 0 0 1 .75.75V18a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
  </svg>
);

export const FastForwardIcon: React.FC<{ className?: string; title?: string }> = ({ className, title }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${className}`} aria-hidden={!title} role={title ? "img" : "presentation"}>
    {title && <title>{title}</title>}
    <path fillRule="evenodd" d="M2.25 5.653c0-1.427 1.529-2.33 2.779-1.643l7.5 4.156c1.166.647 1.166 2.273 0 2.92l-7.5 4.156C3.779 15.93 2.25 15.026 2.25 13.597V5.653Zm9.75 0c0-1.427 1.529-2.33 2.779-1.643l7.5 4.156c1.166.647 1.166 2.273 0 2.92l-7.5 4.156c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
  </svg>
);

export const HandshakeIcon: React.FC<{ className?: string; title?: string }> = ({ className, title }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${className}`} aria-hidden={!title} role={title ? "img" : "presentation"}>
    {title && <title>{title}</title>}
    <path fillRule="evenodd" d="M10.5 3A1.501 1.501 0 0 0 9 4.5v3.58a.75.75 0 0 0 1.454.238l.19-.381A1.502 1.502 0 0 1 12.112 7.5h2.136a1.5 1.5 0 0 0 1.15-.54l1.628-2.238A1.5 1.5 0 0 0 15.75 3h-5.25Zm.09 8.153 3.061-3.061A.75.75 0 0 1 15 8.25h.039a.75.75 0 0 1 .675.466l.6 1.5a.75.75 0 0 1-.201.83L12.97 14.19a2.534 2.534 0 0 1-3.686-3.4l1.216-1.137ZM9.53 15.97a.75.75 0 0 1 0-1.06l3.06-3.06a.75.75 0 1 1 1.06 1.06l-3.06 3.06a.75.75 0 0 1-1.06 0ZM4.5 9A1.5 1.5 0 0 0 3 10.5v5.25A1.5 1.5 0 0 0 4.5 17.25h2.238a1.502 1.502 0 0 1 1.469 1.188l.19.381a.75.75 0 0 0 1.454-.238V15a1.5 1.5 0 0 0-1.5-1.5H6a.75.75 0 0 1 0-1.5h1.5A1.5 1.5 0 0 0 9 10.5V9A1.5 1.5 0 0 0 7.5 7.5H4.5A1.5 1.5 0 0 0 3 9a1.501 1.501 0 0 0 1.5 1.5Z" clipRule="evenodd" />
    <path d="m12.97 14.19-.001.002a4.035 4.035 0 0 0 5.459-5.92l.001-.002L18.33 5.466a2.25 2.25 0 0 0-3.486-2.994L9.62 6.188a4.034 4.034 0 0 0-5.516 5.807L4.5 12.75H6a.75.75 0 0 1 0 1.5H4.5A1.5 1.5 0 0 0 3 15.75v.75a3 3 0 0 0 3 3h.75A4.034 4.034 0 0 0 12.97 14.19Z" />
  </svg>
);

export const BriefcaseIcon: React.FC<{ className?: string; title?: string }> = ({ className, title }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`} aria-hidden={!title} role={title ? "img" : "presentation"}>
    {title && <title>{title}</title>}
    <path fillRule="evenodd" d="M7.5 5.25A2.25 2.25 0 0 1 9.75 3h4.5A2.25 2.25 0 0 1 16.5 5.25V6h3.75A2.25 2.25 0 0 1 22.5 8.25v8.25A2.25 2.25 0 0 1 20.25 19H3.75A2.25 2.25 0 0 1 1.5 16.5V8.25A2.25 2.25 0 0 1 3.75 6H7.5V5.25ZM9 6.75V8.25h6V6.75H9Z" clipRule="evenodd" />
    <path d="M3 11.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" />
  </svg>
);

// Deprecated Icons (Original Male/Female)
export const MaleIcon: React.FC<{ className?: string; title?: string }> = ({ className, title }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`} aria-hidden={!title} role={title ? "img" : "presentation"}>
    {title && <title>{title}</title>}
    <path fillRule="evenodd" d="M12.56 3.066A9.75 9.75 0 0 0 9.75 21H2.25a.75.75 0 0 1 0-1.5h7.5a8.25 8.25 0 0 1 8.14-7.426A.75.75 0 0 1 18 12.75v4.665a.75.75 0 0 1-1.21.623L14.32 16.1V12.75a.75.75 0 0 1 1.5 0V15l1.27 1.207a.75.75 0 0 1 .23.543V12.75a.75.75 0 0 1 .75-.75H21V7.875A5.25 5.25 0 0 0 12.56 3.066ZM12.75 4.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z" clipRule="evenodd" />
  </svg>
);

export const FemaleIcon: React.FC<{ className?: string; title?: string }> = ({ className, title }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`} aria-hidden={!title} role={title ? "img" : "presentation"}>
    {title && <title>{title}</title>}
    <path fillRule="evenodd" d="M11.25 4.5A6.75 6.75 0 1 0 4.5 11.25a.75.75 0 0 1 1.5 0A5.25 5.25 0 1 1 11.25 6a.75.75 0 0 1 0-1.5ZM12.75 12.75a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0V16.5h2.25a.75.75 0 0 0 0-1.5H12.75V12.75Z" clipRule="evenodd" />
  </svg>
);