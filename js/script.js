/* 
=========================================
  BRAINSTEADY TECH - CORE ENGINE SCRIPT
=========================================
  Author: Founder & Developer @ Brainsteady Tech
  Description: Interactive behaviors including viewport scroll reveals, typing, 
               active page route selectors, project card filtering, progress loading,
               and dynamic form validation.
*/

document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================
  //  1. PAGE LOADER & TRANSITION HANDLER
  // ==========================================
  const loader = document.getElementById("page-loader");
  if (loader) {
    window.addEventListener("load", () => {
      // Fade out effect
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.style.display = "none";
      }, 500);
    });

    // Fallback: hide loader after 3 seconds in case window load event fails
    setTimeout(() => {
      if (loader.style.display !== "none") {
        loader.style.opacity = "0";
        setTimeout(() => { loader.style.display = "none"; }, 500);
      }
    }, 3000);
  }

  // ==========================================
  //  2. NAVBAR STYLE SWITCHER & AUTO-ACTIVE LINKS
  // ==========================================
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("navbar-scrolled");
    } else {
      navbar.classList.remove("navbar-scrolled");
    }
  });

  // Set active class on nav-link depending on the current file path
  const currentPath = window.location.pathname;
  const filename = currentPath.substring(currentPath.lastIndexOf("/") + 1);
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  
  let linkMatched = false;
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === filename || (filename === "" && href === "index.html")) {
      link.classList.add("active");
      linkMatched = true;
    } else {
      link.classList.remove("active");
    }
  });

  // Fallback: If navigating relative roots or local host setups, check includes
  if (!linkMatched) {
    navLinks.forEach(link => {
      const href = link.getAttribute("href");
      if (currentPath.includes(href) && href !== "") {
        link.classList.add("active");
      }
    });
  }

  // ==========================================
  //  3. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // ==========================================
  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target); // Trigger once
        }
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ==========================================
  //  4. SKILL BARS ANIMATION IN ABOUT PAGE
  // ==========================================
  const progressBars = document.querySelectorAll(".progress-bar-custom");
  if (progressBars.length > 0) {
    const skillsSection = document.querySelector(".skills-section-wrapper");
    const animateBars = () => {
      progressBars.forEach(bar => {
        const val = bar.getAttribute("data-value");
        bar.style.width = val + "%";
      });
    };

    if (skillsSection) {
      const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateBars();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      skillsObserver.observe(skillsSection);
    } else {
      // Fallback
      setTimeout(animateBars, 800);
    }
  }

  // ==========================================
  //  5. HERO BANNER TYPING SLOGAN
  // ==========================================
  const typeTextElement = document.getElementById("typed-text");
  if (typeTextElement) {
    const slogans = [
      "Responsive Website Development",
      "Creative Poster & Graphic Designs",
      "Tailored Coding Tutoring & Mentorship",
      "Practical Cybersecurity & Cloud Labs",
      "Software & Academic Assignment Help"
    ];
    let sloganIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;

    const typeEffect = () => {
      const currentSlogan = slogans[sloganIndex];
      
      if (isDeleting) {
        // Delete characters
        typeTextElement.textContent = currentSlogan.substring(0, charIndex - 1);
        charIndex--;
        typeDelay = 40;
      } else {
        // Type characters
        typeTextElement.textContent = currentSlogan.substring(0, charIndex + 1);
        charIndex++;
        typeDelay = 80;
      }

      if (!isDeleting && charIndex === currentSlogan.length) {
        // Slogan finished, pause before deletion
        typeDelay = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        // Slogan deleted, move to the next
        isDeleting = false;
        sloganIndex = (sloganIndex + 1) % slogans.length;
        typeDelay = 400;
      }

      setTimeout(typeEffect, typeDelay);
    };

    // Begin typing loop
    setTimeout(typeEffect, 1000);
  }

  // ==========================================
  //  6. PORTFOLIO FILTER SYSTEM (PROJECTS PAGE)
  // ==========================================
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-filter-item");

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        // Remove active class from buttons
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filterValue = btn.getAttribute("data-filter");

        projectCards.forEach(card => {
          // Add animation fade behavior
          card.style.opacity = "0";
          card.style.transform = "scale(0.8) translateY(10px)";
          
          setTimeout(() => {
            if (filterValue === "all" || card.classList.contains(filterValue)) {
              card.style.display = "block";
              setTimeout(() => {
                card.style.opacity = "1";
                card.style.transform = "scale(1) translateY(0)";
              }, 50);
            } else {
              card.style.display = "none";
            }
          }, 300);
        });
      });
    });
  }

  // ==========================================
  //  7. FORM VALIDATION & MODAL SUCCESS (CONTACT PAGE)
  // ==========================================
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const service = document.getElementById("service").value;
      const message = document.getElementById("message").value.trim();

      // Reset state
      formStatus.className = "alert d-none";
      formStatus.innerHTML = "";

      // Simple email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Validation logic
      if (!name) {
        showFormAlert("Please enter your name.", "danger");
        return;
      }

      if (!email || !emailRegex.test(email)) {
        showFormAlert("Please enter a valid email address.", "danger");
        return;
      }

      if (!service || service === "") {
        showFormAlert("Please select the service you are interested in.", "danger");
        return;
      }

      if (!message || message.length < 10) {
        showFormAlert("Please write a detailed message (minimum 10 characters).", "danger");
        return;
      }

      // Success mockup simulation
      showFormAlert("<i class='bi bi-check-circle-fill me-2'></i> Message sent successfully! Brainsteady Tech will respond within 24 hours.", "success");
      
      // Clear form
      contactForm.reset();
    });

    const showFormAlert = (msg, type) => {
      formStatus.innerHTML = msg;
      formStatus.className = `alert alert-${type} reveal-fast mt-3`;
      formStatus.classList.remove("d-none");
      
      // Auto-scroll to alert status
      formStatus.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };
  }

  // ==========================================
  //  8. SCROLL TO TOP BUTTON
  // ==========================================
  const mybutton = document.getElementById("btn-back-to-top");
  if (mybutton) {
    window.addEventListener("scroll", () => {
      if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        mybutton.style.display = "flex";
      } else {
        mybutton.style.display = "none";
      }
    });

    mybutton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // ==========================================
  //  9. SMOOTH SCROLL FOR INNER ANCHOR LINKS
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId !== "#" && targetId !== "") {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // ==========================================
  //  10. PACMAN RETRO MINI-GAME
  // ==========================================
  const canvas = document.getElementById("pacman-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    
    // 15x15 Pacman Grid Map (1 = Wall, 0 = Dot, 2 = Empty Path)
    let gameMap = [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
      [1,0,1,1,0,1,0,1,0,1,0,1,1,0,1],
      [1,0,0,0,0,1,0,0,0,1,0,0,0,0,1],
      [1,1,0,1,1,1,1,2,1,1,1,1,0,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,0,1,1,2,1,1,0,1,1,0,1],
      [1,0,0,0,0,1,2,2,2,1,0,0,0,0,1],
      [1,0,1,1,0,1,1,1,1,1,0,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,0,1,1,1,1,2,1,1,1,1,0,1,1],
      [1,0,0,0,0,1,0,0,0,1,0,0,0,0,1],
      [1,0,1,1,0,1,0,1,0,1,0,1,1,0,1],
      [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];
    
    const mapRows = gameMap.length;
    const mapCols = gameMap[0].length;
    const tileSize = canvas.width / mapCols;
    
    let score = 0;
    let lives = 3;
    let gameState = "START"; // START, PLAYING, GAMEOVER, VICTORY
    let totalDots = 0;
    
    const countDots = () => {
      let count = 0;
      for (let r = 0; r < mapRows; r++) {
        for (let c = 0; c < mapCols; c++) {
          if (gameMap[r][c] === 0) count++;
        }
      }
      return count;
    };
    
    let initialMap = JSON.parse(JSON.stringify(gameMap));
    
    let pacman = {
      x: 7.0,
      y: 11.0,
      dirX: 0,
      dirY: 0,
      nextDirX: 0,
      nextDirY: 0,
      speed: 0.08,
      mouthAngle: 0.2,
      mouthSpeed: 0.015,
      mouthDir: 1
    };
    
    let ghosts = [
      { x: 1.0, y: 5.0, dirX: 1, dirY: 0, color: "#ff0000", speed: 0.06, name: "Blinky" },
      { x: 13.0, y: 9.0, dirX: -1, dirY: 0, color: "#ff69b4", speed: 0.055, name: "Inky" }
    ];
    
    const resetGameVariables = () => {
      gameMap = JSON.parse(JSON.stringify(initialMap));
      totalDots = countDots();
      score = 0;
      lives = 3;
      resetPositions();
    };
    
    const resetPositions = () => {
      pacman.x = 7.0;
      pacman.y = 11.0;
      pacman.dirX = 0;
      pacman.dirY = 0;
      pacman.nextDirX = 0;
      pacman.nextDirY = 0;
      
      ghosts[0].x = 1.0;
      ghosts[0].y = 5.0;
      ghosts[0].dirX = 1;
      ghosts[0].dirY = 0;
      
      ghosts[1].x = 13.0;
      ghosts[1].y = 9.0;
      ghosts[1].dirX = -1;
      ghosts[1].dirY = 0;
    };
    
    totalDots = countDots();
    
    // Keyboard inputs
    window.addEventListener("keydown", (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", "Enter"].includes(e.code)) {
        // Prevent scrolling if on home screen
        if (document.getElementById("pacman-canvas")) {
          e.preventDefault();
        }
      }
      
      if (gameState === "START" || gameState === "GAMEOVER" || gameState === "VICTORY") {
        if (e.code === "Space" || e.code === "Enter") {
          resetGameVariables();
          gameState = "PLAYING";
        }
        return;
      }
      
      switch (e.code) {
        case "ArrowUp":
        case "KeyW":
          pacman.nextDirX = 0;
          pacman.nextDirY = -1;
          break;
        case "ArrowDown":
        case "KeyS":
          pacman.nextDirX = 0;
          pacman.nextDirY = 1;
          break;
        case "ArrowLeft":
        case "KeyA":
          pacman.nextDirX = -1;
          pacman.nextDirY = 0;
          break;
        case "ArrowRight":
        case "KeyD":
          pacman.nextDirX = 1;
          pacman.nextDirY = 0;
          break;
      }
    });
    
    // D-Pad inputs for mobile/touch
    const setNextDir = (dx, dy) => {
      if (gameState === "START" || gameState === "GAMEOVER" || gameState === "VICTORY") {
        resetGameVariables();
        gameState = "PLAYING";
        return;
      }
      pacman.nextDirX = dx;
      pacman.nextDirY = dy;
    };
    
    document.getElementById("dpad-up")?.addEventListener("click", () => setNextDir(0, -1));
    document.getElementById("dpad-down")?.addEventListener("click", () => setNextDir(0, 1));
    document.getElementById("dpad-left")?.addEventListener("click", () => setNextDir(-1, 0));
    document.getElementById("dpad-right")?.addEventListener("click", () => setNextDir(1, 0));
    
    const isWall = (x, y) => {
      const r = Math.round(y);
      const c = Math.round(x);
      if (r < 0 || r >= mapRows || c < 0 || c >= mapCols) return true;
      return gameMap[r][c] === 1;
    };
    
    const updateGame = () => {
      if (gameState !== "PLAYING") return;
      
      // Mouth chomp animation
      pacman.mouthAngle += pacman.mouthSpeed * pacman.mouthDir;
      if (pacman.mouthAngle > 0.4 || pacman.mouthAngle < 0.05) {
        pacman.mouthDir *= -1;
      }
      
      // Grid alignment checks
      const isAlignedX = Math.abs(pacman.x - Math.round(pacman.x)) < 0.05;
      const isAlignedY = Math.abs(pacman.y - Math.round(pacman.y)) < 0.05;
      
      if (isAlignedX && isAlignedY) {
        pacman.x = Math.round(pacman.x);
        pacman.y = Math.round(pacman.y);
        
        // Eat Dot
        if (gameMap[pacman.y][pacman.x] === 0) {
          gameMap[pacman.y][pacman.x] = 2; 
          score += 10;
          totalDots--;
          if (totalDots <= 0) {
            gameState = "VICTORY";
          }
        }
        
        // Apply queued direction
        if (pacman.nextDirX !== 0 || pacman.nextDirY !== 0) {
          if (!isWall(pacman.x + pacman.nextDirX, pacman.y + pacman.nextDirY)) {
            pacman.dirX = pacman.nextDirX;
            pacman.dirY = pacman.nextDirY;
          }
        }
        
        // Boundary wall collision
        if (isWall(pacman.x + pacman.dirX, pacman.y + pacman.dirY)) {
          pacman.dirX = 0;
          pacman.dirY = 0;
        }
      }
      
      pacman.x += pacman.dirX * pacman.speed;
      pacman.y += pacman.dirY * pacman.speed;
      
      // Update Ghosts
      ghosts.forEach(ghost => {
        const isGhostAlignedX = Math.abs(ghost.x - Math.round(ghost.x)) < 0.08;
        const isGhostAlignedY = Math.abs(ghost.y - Math.round(ghost.y)) < 0.08;
        
        if (isGhostAlignedX && isGhostAlignedY) {
          ghost.x = Math.round(ghost.x);
          ghost.y = Math.round(ghost.y);
          
          let possibleDirections = [];
          const dirs = [
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 }
          ];
          
          dirs.forEach(d => {
            if (!isWall(ghost.x + d.x, ghost.y + d.y)) {
              if (d.x !== -ghost.dirX || d.y !== -ghost.dirY) {
                possibleDirections.push(d);
              }
            }
          });
          
          if (possibleDirections.length === 0) {
            dirs.forEach(d => {
              if (!isWall(ghost.x + d.x, ghost.y + d.y)) {
                possibleDirections.push(d);
              }
            });
          }
          
          if (possibleDirections.length > 0) {
            let selectedDir = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
            
            // 40% Smart Tracking AI
            if (possibleDirections.length > 1 && Math.random() < 0.55) {
              let bestDir = selectedDir;
              let minDist = 999;
              possibleDirections.forEach(d => {
                const nextX = ghost.x + d.x;
                const nextY = ghost.y + d.y;
                const dist = Math.hypot(pacman.x - nextX, pacman.y - nextY);
                if (dist < minDist) {
                  minDist = dist;
                  bestDir = d;
                }
              });
              selectedDir = bestDir;
            }
            
            ghost.dirX = selectedDir.x;
            ghost.dirY = selectedDir.y;
          }
        }
        
        ghost.x += ghost.dirX * ghost.speed;
        ghost.y += ghost.dirY * ghost.speed;
        
        // Touch collision with Pacman
        const distToPacman = Math.hypot(pacman.x - ghost.x, pacman.y - ghost.y);
        if (distToPacman < 0.6) {
          lives--;
          if (lives <= 0) {
            gameState = "GAMEOVER";
          } else {
            resetPositions();
          }
        }
      });
    };
    
    const drawGame = () => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      for (let r = 0; r < mapRows; r++) {
        for (let c = 0; c < mapCols; c++) {
          if (gameMap[r][c] === 1) {
            ctx.fillStyle = "#001a00";
            ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);
            ctx.strokeStyle = "#005500";
            ctx.lineWidth = 1;
            ctx.strokeRect(c * tileSize + 1, r * tileSize + 1, tileSize - 2, tileSize - 2);
          } else if (gameMap[r][c] === 0) {
            ctx.beginPath();
            ctx.arc(c * tileSize + tileSize/2, r * tileSize + tileSize/2, 2.5, 0, 2 * Math.PI);
            ctx.fillStyle = "#ffd2b5";
            ctx.fill();
            ctx.closePath();
          }
        }
      }
      
      // Draw Pacman
      if (gameState === "PLAYING" || gameState === "START") {
        ctx.beginPath();
        let rotationAngle = 0;
        if (pacman.dirX === 1) rotationAngle = 0;
        else if (pacman.dirX === -1) rotationAngle = Math.PI;
        else if (pacman.dirY === 1) rotationAngle = 0.5 * Math.PI;
        else if (pacman.dirY === -1) rotationAngle = 1.5 * Math.PI;
        
        ctx.arc(
          pacman.x * tileSize + tileSize/2,
          pacman.y * tileSize + tileSize/2,
          tileSize/2 - 2,
          rotationAngle + pacman.mouthAngle,
          rotationAngle + 2 * Math.PI - pacman.mouthAngle
        );
        ctx.lineTo(pacman.x * tileSize + tileSize/2, pacman.y * tileSize + tileSize/2);
        ctx.fillStyle = "#ffff00";
        ctx.fill();
        ctx.closePath();
      }
      
      // Draw Ghosts
      if (gameState === "PLAYING") {
        ghosts.forEach(ghost => {
          const gx = ghost.x * tileSize + tileSize/2;
          const gy = ghost.y * tileSize + tileSize/2;
          const r = tileSize/2 - 2;
          
          ctx.beginPath();
          ctx.arc(gx, gy, r, Math.PI, 0, false);
          ctx.lineTo(gx + r, gy + r);
          ctx.lineTo(gx + r - 3, gy + r - 3);
          ctx.lineTo(gx + r/2, gy + r);
          ctx.lineTo(gx, gy + r - 3);
          ctx.lineTo(gx - r/2, gy + r);
          ctx.lineTo(gx - r + 3, gy + r - 3);
          ctx.lineTo(gx - r, gy + r);
          ctx.fillStyle = ghost.color;
          ctx.fill();
          ctx.closePath();
          
          // Eyes
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(gx - 3.5, gy - 2, 2.5, 0, 2*Math.PI);
          ctx.arc(gx + 3.5, gy - 2, 2.5, 0, 2*Math.PI);
          ctx.fill();
          ctx.closePath();
          
          ctx.fillStyle = "#0000ff";
          ctx.beginPath();
          ctx.arc(gx - 3.5 + ghost.dirX, gy - 2 + ghost.dirY, 1, 0, 2*Math.PI);
          ctx.arc(gx + 3.5 + ghost.dirX, gy - 2 + ghost.dirY, 1, 0, 2*Math.PI);
          ctx.fill();
          ctx.closePath();
        });
      }
      
      // Display Screens
      if (gameState === "START") {
        ctx.fillStyle = "rgba(0,0,0,0.85)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = "14px 'Press Start 2P'";
        ctx.fillStyle = "#ffff00";
        ctx.textAlign = "center";
        ctx.fillText("PAC-MAN ARCADE", canvas.width / 2, canvas.height / 2 - 30);
        
        ctx.font = "7px 'Press Start 2P'";
        ctx.fillStyle = "#00ff41";
        ctx.fillText("CLICK DPAD OR PRESS ENTER", canvas.width / 2, canvas.height / 2 + 10);
        ctx.fillText("TO INSERT COIN", canvas.width / 2, canvas.height / 2 + 22);
        
        ctx.font = "6px 'Press Start 2P'";
        ctx.fillStyle = "#a1a1aa";
        ctx.fillText("DEVELOPER BREAK ROOM", canvas.width / 2, canvas.height / 2 + 60);
      } else if (gameState === "GAMEOVER") {
        ctx.fillStyle = "rgba(0,0,0,0.85)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = "14px 'Press Start 2P'";
        ctx.fillStyle = "#ef4444";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 10);
        
        ctx.font = "7px 'Press Start 2P'";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("PRESS ENTER OR DPAD TO RESTART", canvas.width / 2, canvas.height / 2 + 25);
      } else if (gameState === "VICTORY") {
        ctx.fillStyle = "rgba(0,0,0,0.85)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = "14px 'Press Start 2P'";
        ctx.fillStyle = "#22c55e";
        ctx.textAlign = "center";
        ctx.fillText("VICTORY!", canvas.width / 2, canvas.height / 2 - 10);
        
        ctx.font = "7px 'Press Start 2P'";
        ctx.fillStyle = "#ffff00";
        ctx.fillText(`SCORE: ${score}`, canvas.width / 2, canvas.height / 2 + 15);
        ctx.fillStyle = "#ffffff";
        ctx.fillText("PRESS ENTER OR DPAD TO PLAY AGAIN", canvas.width / 2, canvas.height / 2 + 35);
      }
      
      // Update UI Scores
      const scoreElement = document.getElementById("arcade-score");
      const livesElement = document.getElementById("arcade-lives");
      if (scoreElement) scoreElement.textContent = score;
      if (livesElement) {
        let heartString = "";
        for (let i = 0; i < lives; i++) heartString += "❤️";
        livesElement.textContent = heartString || "💀";
      }
    };
    
    const gameLoop = () => {
      updateGame();
      drawGame();
      requestAnimationFrame(gameLoop);
    };
    
    drawGame();
    gameLoop();
  }

});

