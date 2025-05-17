import type React from "react"
import "./globals.css"
import type { Metadata, Viewport } from "next/types"
import { Inter } from "next/font/google"
import Script from "next/script"
import ClientPreloaderContainer from "@/components/client-preloader-container"
import { ErrorBoundary } from "@/components/error-boundary"
import PageTransition from "@/components/page-transition"
import { ThemeProvider } from "@/components/theme-provider"
import OneSignalProvider from "@/components/one-signal-provider"
import AuthWrapper from "@/components/auth/auth-wrapper"
import SectionPersistenceWrapper from "@/components/section-persistence-wrapper"
import { baseMetadata, viewportConfig } from "./metadata-config"
import { getOrganizationData, getWebsiteData } from "@/lib/structured-data"
import StructuredData from "@/components/structured-data"

const inter = Inter({ subsets: ["latin"] })

// Get the base URL for absolute URLs
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com"

export const metadata: Metadata = {
  title: "Big Based",
  description: "Big Based is a cultural revolution platform with a living library of truth, faith, and insight.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon0.svg", type: "image/svg+xml" },
      { url: "/icon1.png", type: "image/png" },
    ],
    apple: {
      url: "/apple-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
  },
  manifest: "/manifest.json",
  themeColor: "#ffffff",
  appleWebApp: {
    title: "Big Based",
    statusBarStyle: "default",
  },
  metadataBase: new URL(baseUrl),
  openGraph: {
    ...baseMetadata.openGraph,
    url: baseUrl,
    images: [
      {
        url: `${baseUrl}/BigBasedPreview.png`,
        width: 1200,
        height: 630,
        alt: "Big Based - Answer to Madness",
      },
    ],
  },
  twitter: {
    ...baseMetadata.twitter,
    images: [`${baseUrl}/BigBasedPreview.png`],
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = viewportConfig

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Prepare structured data for the entire site
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [getOrganizationData(), getWebsiteData()],
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Explicit OpenGraph tags to ensure they're detected */}
        <meta property="og:title" content="Big Based - Answer to Madness" />
        <meta
          property="og:description"
          content="Big Based isn't just a platform, it's a cultural revolution. At its core lies a living library of truth, faith, and insight, 10,000+ meticulously researched pages designed to educate, inspire, and transform."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={baseUrl} />
        <meta property="og:image" content={`${baseUrl}/BigBasedPreview.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Big Based" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@bigbased" />
        <meta name="twitter:title" content="Big Based - Answer to Madness" />
        <meta
          name="twitter:description"
          content="Big Based isn't just a platform, it's a cultural revolution. At its core lies a living library of truth, faith, and insight, 10,000+ meticulously researched pages designed to educate, inspire, and transform."
        />
        <meta name="twitter:image" content={`${baseUrl}/BigBasedPreview.png`} />

        {/* Explicit favicon links for maximum compatibility */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.png" color="#000000" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />

        {/* Resource preloading */}
        <link rel="preload" href="/bb-logo.png" as="image" />
        <link rel="preload" href="/american-flag.png" as="image" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://cdn.onesignal.com" />

        {/* Inline script to show preloader immediately before any React hydration */}
        <Script id="show-preloader" strategy="beforeInteractive">{`
// Create and show preloader immediately
(function() {
  // Define resource tracking functions first
  window.registerResource = function(id, weight) {
    if (!window.resourceStatus) {
      window.resourceStatus = {};
      window.totalResources = 0;
      window.resourcesLoaded = 0;
    }
    
    if (!window.resourceStatus[id]) {
      window.resourceStatus[id] = { status: 'pending', weight: weight || 1 };
      window.totalResources += (weight || 1);
      updateProgress();
    }
  };
  
  window.resourceLoaded = function(id) {
    if (window.resourceStatus && window.resourceStatus[id] && window.resourceStatus[id].status !== 'loaded') {
      window.resourcesLoaded += window.resourceStatus[id].weight;
      window.resourceStatus[id].status = 'loaded';
      updateProgress();
    }
  };
  
  // Update the loading progress based on actual resources
  function updateProgress() {
    var progress = window.totalResources > 0 ? Math.min(Math.floor((window.resourcesLoaded / window.totalResources) * 100), 100) : 0;
    if (window.loadingProgress && window.percentageDisplay) {
      window.loadingProgress.style.width = progress + '%';
      window.percentageDisplay.textContent = progress + '%';
    }
  }

  // Loading messages
  var loadingMessages = [
    "Reclaiming digital sovereignty...",
    "Preserving truth in a world of deception...",
    "Building a parallel economy...",
    "Connecting freedom-minded individuals...",
    "Restoring faith in our institutions...",
    "Empowering the next generation...",
    "Defending constitutional rights...",
    "Advancing individual liberty...",
    "Cultivating a culture of responsibility...",
    "Dismantling cultural decay...",
    "Archiving censored knowledge...",
    "Forging a path to freedom..."
  ];
  
  // Shuffle and select random messages
  loadingMessages.sort(function() { return 0.5 - Math.random() });
  loadingMessages = loadingMessages.slice(0, 5); // Select 5 random messages
  
  // Select a random animation style (0-3)
  var animationStyle = Math.floor(Math.random() * 4);
  
  var preloader = document.createElement('div');
  preloader.id = 'initial-preloader';
  preloader.style.position = 'fixed';
  preloader.style.inset = '0';
  preloader.style.zIndex = '9999';
  preloader.style.backgroundColor = 'white';
  preloader.style.display = 'flex';
  preloader.style.alignItems = 'center';
  preloader.style.justifyContent = 'center';
  
  // Create logo container
  var logoContainer = document.createElement('div');
  logoContainer.style.position = 'relative';
  logoContainer.style.display = 'flex';
  logoContainer.style.flexDirection = 'column';
  logoContainer.style.alignItems = 'center';
  logoContainer.style.width = '320px'; // Set width for message container
  
  // Create fixed height containers to prevent layout shifts
  var logoWrapper = document.createElement('div');
  logoWrapper.style.height = '64px'; // Fixed height for logo
  logoWrapper.style.display = 'flex';
  logoWrapper.style.alignItems = 'center';
  logoWrapper.style.justifyContent = 'center';
  logoWrapper.style.marginBottom = '16px';
  
  // Create logo image element
  var logoImg = document.createElement('img');
  logoImg.src = '/bb-logo.png';
  logoImg.alt = 'BigBased Logo';
  logoImg.style.width = '96px';
  logoImg.style.height = '96px';
  logoImg.style.opacity = '0';
  
  // Apply different animation styles based on random selection
  switch(animationStyle) {
    case 0: // Fade
      logoImg.style.transform = 'scale(0.8)';
      logoImg.style.transition = 'opacity 0.5s, transform 0.5s';
      break;
    case 1: // Slide
      logoImg.style.transform = 'translateX(-50px)';
      logoImg.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      break;
    case 2: // Scale
      logoImg.style.transform = 'scale(0)';
      logoImg.style.transition = 'opacity 0.5s, transform 0.5s cubic-bezier(.17,.67,.83,.67)';
      break;
    case 3: // Reveal
      logoImg.style.transform = 'translateY(-20px)';
      logoImg.style.transition = 'opacity 0.4s, transform 0.4s';
      break;
  }
  
  // Handle image load error
  logoImg.onerror = function() {
    // Create fallback text logo
    var fallbackLogo = document.createElement('div');
    fallbackLogo.style.backgroundColor = 'black';
    fallbackLogo.style.color = 'white';
    fallbackLogo.style.padding = '12px 24px';
    fallbackLogo.style.fontSize = '32px';
    fallbackLogo.style.fontWeight = 'bold';
    fallbackLogo.style.opacity = '0';
    
    // Apply same animation styles
    switch(animationStyle) {
      case 0: // Fade
        fallbackLogo.style.transform = 'scale(0.8)';
        fallbackLogo.style.transition = 'opacity 0.5s, transform 0.5s';
        break;
      case 1: // Slide
        fallbackLogo.style.transform = 'translateX(-50px)';
        fallbackLogo.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        break;
      case 2: // Scale
        fallbackLogo.style.transform = 'scale(0)';
        fallbackLogo.style.transition = 'opacity 0.5s, transform 0.5s cubic-bezier(.17,.67,.83,.67)';
        break;
      case 3: // Reveal
        fallbackLogo.style.transform = 'translateY(-20px)';
        fallbackLogo.style.transition = 'opacity 0.4s, transform 0.4s';
        break;
    }
    
    fallbackLogo.textContent = 'BB';
    logoWrapper.replaceChild(fallbackLogo, logoImg);
    
    // Animate the fallback logo
    setTimeout(function() {
      fallbackLogo.style.opacity = '1';
      
      switch(animationStyle) {
        case 0: // Fade
          fallbackLogo.style.transform = 'scale(1)';
          break;
        case 1: // Slide
          fallbackLogo.style.transform = 'translateX(0)';
          break;
        case 2: // Scale
          fallbackLogo.style.transform = 'scale(1)';
          break;
        case 3: // Reveal
          fallbackLogo.style.transform = 'translateY(0)';
          break;
      }
    }, 100);
  };
  
  logoWrapper.appendChild(logoImg);
  
  // Create fixed height container for tagline
  var taglineWrapper = document.createElement('div');
  taglineWrapper.style.height = '32px'; // Fixed height for tagline
  taglineWrapper.style.display = 'flex';
  taglineWrapper.style.alignItems = 'center';
  taglineWrapper.style.justifyContent = 'center';
  taglineWrapper.style.marginBottom = '24px';
  
  // Create tagline
  var tagline = document.createElement('div');
  tagline.style.fontSize = '18px';
  tagline.style.fontWeight = '500';
  tagline.style.textAlign = 'center';
  tagline.style.opacity = '0';
  
  // Apply different animation styles based on random selection
  switch(animationStyle) {
    case 0: // Fade
      tagline.style.transform = 'translateY(20px)';
      tagline.style.transition = 'opacity 0.5s, transform 0.5s';
      tagline.style.transitionDelay = '0.3s';
      break;
    case 1: // Slide
      tagline.style.transform = 'translateX(50px)';
      tagline.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      tagline.style.transitionDelay = '0.2s';
      break;
    case 2: // Scale
      tagline.style.transform = 'scale(0)';
      tagline.style.transition = 'opacity 0.5s, transform 0.5s cubic-bezier(.17,.67,.83,.67)';
      tagline.style.transitionDelay = '0.3s';
      break;
    case 3: // Reveal
      tagline.style.clipPath = 'inset(0 100% 0 0)';
      tagline.style.opacity = '0.3';
      tagline.style.transition = 'clip-path 0.6s ease-out, opacity 0.6s ease-out';
      tagline.style.transitionDelay = '0.4s';
      break;
  }
  
  tagline.textContent = 'BIG BASED';
  taglineWrapper.appendChild(tagline);
  
  // Create fixed height container for message
  var messageWrapper = document.createElement('div');
  messageWrapper.style.height = '48px'; // Fixed height for messages
  messageWrapper.style.display = 'flex';
  messageWrapper.style.alignItems = 'center';
  messageWrapper.style.justifyContent = 'center';
  messageWrapper.style.marginBottom = '16px';
  
  // Create message container
  var messageContainer = document.createElement('div');
  messageContainer.style.textAlign = 'center';
  messageContainer.style.fontSize = '14px';
  messageContainer.style.color = '#555';
  messageContainer.style.fontStyle = 'italic';
  messageContainer.style.opacity = '0';
  messageContainer.style.transition = 'opacity 0.5s';
  messageWrapper.appendChild(messageContainer);
  
  // Create loading bar container with percentage
  var loadingContainer = document.createElement('div');
  loadingContainer.style.width = '100%';
  loadingContainer.style.marginTop = '8px';
  loadingContainer.style.position = 'relative';
  
  // Create percentage display
  var percentageDisplay = document.createElement('div');
  percentageDisplay.style.position = 'absolute';
  percentageDisplay.style.top = '-24px';
  percentageDisplay.style.right = '0';
  percentageDisplay.style.fontSize = '14px';
  percentageDisplay.style.fontWeight = 'bold';
  percentageDisplay.style.color = '#333';
  percentageDisplay.style.opacity = '0';
  percentageDisplay.style.transition = 'opacity 0.5s';
  percentageDisplay.textContent = '0%';
  
  // Create loading bar
  var loadingBar = document.createElement('div');
  loadingBar.style.height = '4px';
  loadingBar.style.width = '100%';
  loadingBar.style.backgroundColor = '#f0f0f0';
  loadingBar.style.borderRadius = '4px';
  loadingBar.style.overflow = 'hidden';
  
  var loadingProgress = document.createElement('div');
  loadingProgress.style.height = '100%';
  loadingProgress.style.width = '0%';
  loadingProgress.style.backgroundColor = 'black';
  loadingProgress.style.transition = 'width 0.3s ease-out';
  
  loadingBar.appendChild(loadingProgress);
  loadingContainer.appendChild(percentageDisplay);
  loadingContainer.appendChild(loadingBar);
  
  // Assemble the preloader
  logoContainer.appendChild(logoWrapper);
  logoContainer.appendChild(taglineWrapper);
  logoContainer.appendChild(messageWrapper);
  logoContainer.appendChild(loadingContainer);
  preloader.appendChild(logoContainer);
  
  // Add to body when it's available
  if (document.body) {
    document.body.appendChild(preloader);
    animatePreloader();
  } else {
    window.addEventListener('DOMContentLoaded', function() {
      document.body.appendChild(preloader);
      animatePreloader();
    });
  }
  
  // Store references for updating progress
  window.loadingProgress = loadingProgress;
  window.percentageDisplay = percentageDisplay;
  
  function animatePreloader() {
    // Animate logo based on style
    setTimeout(function() {
      logoImg.style.opacity = '1';
      
      switch(animationStyle) {
        case 0: // Fade
          logoImg.style.transform = 'scale(1)';
          break;
        case 1: // Slide
          logoImg.style.transform = 'translateX(0)';
          break;
        case 2: // Scale
          logoImg.style.transform = 'scale(1)';
          break;
        case 3: // Reveal
          logoImg.style.transform = 'translateY(0)';
          break;
      }
    }, 100);
    
    // Animate tagline based on style
    setTimeout(function() {
      tagline.style.opacity = '1';
      
      switch(animationStyle) {
        case 0: // Fade
          tagline.style.transform = 'translateY(0)';
          break;
        case 1: // Slide
          tagline.style.transform = 'translateX(0)';
          break;
        case 2: // Scale
          tagline.style.transform = 'scale(1)';
          break;
        case 3: // Reveal
          tagline.style.clipPath = 'inset(0 0% 0 0)';
          break;
      }
    }, 200);
    
    // Show percentage and message
    setTimeout(function() {
      percentageDisplay.style.opacity = '1';
      messageContainer.style.opacity = '1';
    }, 300);
    
    // Display first message
    var currentMessageIndex = 0;
    messageContainer.textContent = loadingMessages[currentMessageIndex];
    
    // Rotate between the selected messages
    var messageInterval = setInterval(function() {
      // Fade out current message
      messageContainer.style.opacity = '0';
      
      setTimeout(function() {
        // Update message
        currentMessageIndex = (currentMessageIndex + 1) % loadingMessages.length;
        messageContainer.textContent = loadingMessages[currentMessageIndex];
        
        // Fade in new message
        messageContainer.style.opacity = '1';
      }, 500); // Half a second for fade out/in
    }, 3000); // Change message every 3 seconds
    
    // Register critical resources
    window.registerResource('critical-css', 2);
    window.registerResource('critical-js', 2);
    window.registerResource('fonts', 1);
    window.registerResource('hero-images', 3);
    window.registerResource('logo-images', 2);
    
    // Preload key images
    function preloadImages() {
      var images = [
        '/bb-logo.png',
        '/american-flag.png',
      ];
      
      var loadedCount = 0;
      var totalImages = images.length;
      
      // If no images to preload, mark as complete immediately
      if (totalImages === 0) {
        window.resourceLoaded('hero-images');
        return;
      }
      
      images.forEach(function(src) {
        if (!src) {
          // Skip undefined sources
          loadedCount++;
          if (loadedCount === totalImages) {
            window.resourceLoaded('hero-images');
          }
          return;
        }
        
        var img = new Image();
        img.onload = function() {
          loadedCount++;
          if (loadedCount === totalImages) {
            window.resourceLoaded('hero-images');
          }
        };
        img.onerror = function() {
          loadedCount++;
          if (loadedCount === totalImages) {
            window.resourceLoaded('hero-images');
          }
        };
        img.src = src;
      });
    }
    
    // Start preloading images
    preloadImages();
    
    // Mark critical CSS as loaded when styles are applied
    if (document.styleSheets.length > 0) {
      window.resourceLoaded('critical-css');
    } else {
      // Wait for styles to load
      var styleCheckInterval = setInterval(function() {
        if (document.styleSheets.length > 0) {
          window.resourceLoaded('critical-css');
          clearInterval(styleCheckInterval);
        }
      }, 100);
    }
    
    // Mark critical JS as loaded
    window.resourceLoaded('critical-js');
    
    // Mark fonts as loaded when they're ready
    if (document.fonts && typeof document.fonts.ready === 'function') {
      document.fonts.ready.then(function() {
        window.resourceLoaded('fonts');
      }).catch(function() {
        // If there's an error, still mark as loaded after a timeout
        setTimeout(function() { window.resourceLoaded('fonts'); }, 2000);
      });
    } else {
      // Fallback for browsers that don't support document.fonts
      setTimeout(function() { window.resourceLoaded('fonts'); }, 1000);
    }
  }
  
  // Store in window to access later
  window.initialPreloader = preloader;
})();
`}</Script>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ErrorBoundary>
            <OneSignalProvider>
              <ClientPreloaderContainer quotesToShow={5}>
                <AuthWrapper>
                  <SectionPersistenceWrapper />
                  <PageTransition>{children}</PageTransition>
                </AuthWrapper>
              </ClientPreloaderContainer>
            </OneSignalProvider>
          </ErrorBoundary>
        </ThemeProvider>
        <StructuredData data={structuredData} />
      </body>
    </html>
  )
}
