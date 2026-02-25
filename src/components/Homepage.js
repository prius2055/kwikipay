import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { useWallet } from "./walletContext";

import MobilePhone from "../img/mobile_phone.png";
import AboutPhone from "../img/about.png";
import Mojeed from "../img/mojeed.jpg";
import Tenny from "../img/tenny.jpg";
import IT from "../img/IT.jpg";

import "./Homepage.css";

const Homepage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const scrollToSection = (section) => {
    document
      .getElementById(section.toLowerCase())
      ?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navLinks = ["HOME", "ABOUT", "FEATURES", "PRICING", "FAQS", "CONTACT"];

  const footerNavLinks = [
    { label: "Developer's API", href: "#api" },
    { label: "About Us", href: "#about" },
    { label: "Services", href: "#about" },
    { label: "F.A.Q's", href: "#faqs" },
  ];

  const features = [
    {
      icon: "➜]",
      title: "AUTOMATION",
      desc: "Convert MTN, 9mobile, Airtel and Glo airtime to cash instantly. Airtime topup and data purchase are automated and get delivered to you almost instantly.",
    },
    {
      icon: "🚀",
      title: "WE'RE FAST",
      desc: "VTVend lets you purchase mobile data, top up airtime, pay your cable and electricity bills e.t.c all at the speed of light.",
    },
    {
      icon: "🛡️",
      title: "YOU'RE SAFE",
      desc: "Your E-wallet is secured with a military grade comodo SSL certificate to ensure that your funds will be safe for as long as you want it to be.",
    },
    {
      icon: "✓",
      title: "WE'RE RELIABLE",
      desc: "We use a customized application specifically designed for testing noise to keep away from people.",
    },
  ];

  const services = [
    {
      icon: "📡",
      title: "BUY DATA",
      desc: "Start enjoying this very low rates Data plan for your internet browsing databundles.",
    },
    {
      icon: "💡",
      title: "UTILITY PAYMENT",
      desc: "Because we understand your needs, we have made bills and utilities payment convenient.",
    },
    {
      icon: "📺",
      title: "CABLE SUBSCRIPTION",
      desc: "Instantly Activate Cable subscription with favourable discount compared to others.",
    },
    {
      icon: "📱",
      title: "AIRTIME TOPUP",
      desc: "Making an online recharge has become very easy and safe on VTVend.",
    },
    {
      icon: "💵",
      title: "AIRTIME TO CASH",
      desc: "We offer this service at a very good attractive rate login to see current conversion rate.",
    },
    {
      icon: "💬",
      title: "BULK SMS",
      desc: "Send BulkSMS to any number for as low as just 1.5kobo per unit.",
    },
  ];

  const stats = [
    { icon: "👥", value: "4560", label: "USERS" },
    { icon: "❤︎", value: "4032", label: "HAPPY CLIENTS" },
    { icon: "★", value: "3238", label: "LOGGED IN USERS" },
    { icon: "🕐", value: "4", label: "YEARS OF EXPERIENCE" },
  ];

  const testimonials = [
    {
      name: "Mojeed",
      role: "Web Developer",
      avatar: Mojeed,
      text: '"I love the quick response to issues. We might just get along well. So far so good. There\'s no star here but I give ⭐⭐⭐.."',
    },
    {
      name: "I.T-Guy",
      role: "UI / UX Designer",
      avatar: IT,
      text: '"This site is great... All thanks to VTVend.com. I can really say that since I joined this site I have been earning more than before..."',
    },
    {
      name: "Tenny",
      role: "Web Developer",
      avatar: Tenny,
      text: '"Amazing!...i recommend to all data resellers...kudos."',
    },
  ];

  const faqs = [
    {
      q: "How To Buy Data?",
      a: "1. Log in to your account\n2. Register if needed\n3. Fund your account\n4. Select payment method",
    },
    {
      q: "How Do I Fund My Wallet?",
      a: "You can fund your wallet using: Bank payment, ATM card via Paystack/Monnify, Payment with airtime, or Coupon Code(s)",
    },
    {
      q: "Can I Send Airtime?",
      a: "Yes, with a small additional charge for payment with airtime.",
    },
    {
      q: "What Are The Codes For Checking Data Balance?",
      a: "MTN: *323#\n9mobile: *228#\nAirtel: *323#\nGlo: *323#",
    },
    {
      q: "Can Data Bought from you be Shared?",
      a: "Only for Glo. MTN, 9mobile, and airtel data can't be shared.",
    },
  ];

  const { dataPlans, fetchDataPlans } = useWallet();

  useEffect(() => {
    fetchDataPlans();
  }, [fetchDataPlans]);

  return (
    <div className="homepage">
      {/* Navigation */}
      <nav className="nav gradient-bg">
        <div className="nav-container">
          <div className="logo">VTvend</div>

          {/* Desktop Nav */}
          <ul className="nav-links desktop-only">
            {navLinks.map((link) => (
              <li key={link}>
                <p onClick={() => scrollToSection(link)}>{link}</p>
              </li>
            ))}
          </ul>

          {/* Desktop Buttons */}
          <div className="nav-buttons desktop-only">
            <Link to="/login" className="btn btn-outline">
              LOGIN
            </Link>
            <Link to="/signup" className="btn btn-primary">
              REGISTER
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
          <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
          <div className="mobile-menu-content">
            <ul className="mobile-nav-links">
              {navLinks.map((link) => (
                <li key={link}>
                  <p onClick={() => scrollToSection(link)}>{link}</p>
                </li>
              ))}
            </ul>
            <div className="mobile-nav-buttons">
              <Link
                to="/login"
                className="btn btn-outline"
                onClick={closeMobileMenu}
              >
                LOGIN
              </Link>
              <Link
                to="/signup"
                className="btn btn-primary"
                onClick={closeMobileMenu}
              >
                REGISTER
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero gradient-bg">
        <div className="hero-container">
          <div className="hero-text">
            <h1>WELCOME TO VTVend</h1>
            <p>
              VTVend is a company of VTVend Nigeria Limited. We offer best deals
              when it comes to internet Data Plans, Airtime, Bills payment like
              GOTV, DSTV & STARTIMES.
            </p>
            <div className="hero-buttons">
              <Link to="/login" className="btn btn-outline">
                LOGIN
              </Link>
              <Link to="/signup" className="btn btn-primary">
                REGISTER
              </Link>
            </div>
          </div>

          <img src={MobilePhone} alt="A mobile phone" className="hero-image" />
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 320">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="
          M0,160
          C90,80  180,240  270,160
          C360,80  450,240  540,160
          C630,80  720,240  810,160
          C900,80  990,240 1080,160
          C1170,80 1260,240 1350,160
          C1400,120 1440,140 1440,160
          V320 H0 Z"
          />
        </svg>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-header">
          <h2 className="section-title">ABOUT US</h2>
          <div className="title-underline big"></div>
          <div className="title-underline small"></div>
        </div>
        <p className="section-description">
          VTVend is a registered telecommunication vendor known for providing
          internet services, airtime VTU, cable TV subscriptions, electricity
          payment, converting airtime to cash, bitcoin buying and selling, and
          selling of UK used phones at affordable prices.
        </p>
        <div className="container about-grid">
          <div className="about-content">
            <h3>RELIABLE TELECOMMUNICATION COMPANY</h3>
            <div className="content-underline"></div>
            <p>
              VTVend also gives people the opportunity of becoming their
              reseller and be making money on hourly and daily basis so as to
              boost their financial status.
            </p>
            <p>
              We offer instant recharge of Airtime, Databundle, CableTV (DStv,
              GOtv & Startimes), Electricity Bill Payment, Conversion of Airtime
              to cash and selling of result checkers(WAEC & NECO) at better
              rates than others.
            </p>
            <div className="check-list">
              {["EASY TO USED", "EASY TO CUSTOMIZE", "AWESOME DESIGN"].map(
                (item, i) => (
                  <div key={i} className="check-item">
                    <span className="check-icon">✓</span>
                    <span>{item}</span>
                  </div>
                ),
              )}
            </div>
          </div>

          <img src={AboutPhone} alt="A mobile phone" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <svg className="features-wave-top" viewBox="0 0 1440 320">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="
            M0,160
            C29,187 58,133 87,160
            C116,187 145,133 174,160
            C203,187 232,133 261,160
            C290,187 319,133 348,160
            C377,187 406,133 435,160
            C464,187 493,133 522,160
            C551,187 580,133 609,160
            C638,187 667,133 696,160
            C725,187 754,133 783,160
            C812,187 841,133 870,160
            C899,187 928,133 957,160
            C986,187 1015,133 1044,160
            C1073,187 1102,133 1131,160
            C1160,187 1189,133 1218,160
            C1247,187 1276,133 1305,160
            C1334,187 1363,133 1392,160
            C1416,171 1430,149 1440,160
            V0 H0 Z
            "
          />
        </svg>

        <div className="section-header">
          <h2 className="section-title">WHY CHOOSE US?</h2>
          <div className="title-underline big"></div>
          <div className="title-underline small"></div>
          <p className="section-description">
            Here at VTVend our services are completely Fast, Secure & Automated.
            We provide 24/7 Support to our registered users.
          </p>
        </div>

        <div className="container features-content-container">
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-content">
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <img src={MobilePhone} alt="App Mockup mobile phone"></img>
        </div>
        <svg className="features-wave-bottom" viewBox="0 0 1440 320">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="
              M0,160
    C24,133 48,187 72,160
    C96,133 120,187 144,160
    C168,133 192,187 216,160
    C240,133 264,187 288,160
    C312,133 336,187 360,160
    C384,133 408,187 432,160
    C456,133 480,187 504,160
    C528,133 552,187 576,160
    C600,133 624,187 648,160
    C672,133 696,187 720,160
    C744,133 768,187 792,160
    C816,133 840,187 864,160
    C888,133 912,187 936,160
    C960,133 984,187 1008,160
    C1032,133 1056,187 1080,160
    C1104,133 1128,187 1152,160
    C1176,133 1200,187 1224,160
    C1248,133 1272,187 1296,160
    C1320,133 1344,187 1368,160
    C1384,149 1412,171 1440,160
    V320 H0 Z
    "
          />
        </svg>
      </section>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">OUR AWSOME SERVICES</h2>
          <div className="title-underline big"></div>
          <div className="title-underline small"></div>
          <p className="section-description">We Provide The Best Services.</p>
        </div>
        <div className="services-grid">
          {services.map((s, i) => (
            <div key={i} className="service-card">
              <div className="service-icon">{s.icon}</div>
              <div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <section className="stats-section">
        <svg className="stats-wave-top" viewBox="0 0 1440 240">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,100
      C29,118 58,82 87,100
      C116,118 145,82 174,100
      C203,118 232,82 261,100
      C290,118 319,82 348,100
      C377,118 406,82 435,100
      C464,118 493,82 522,100
      C551,118 580,82 609,100
      C638,118 667,82 696,100
      C725,118 754,82 783,100
      C812,118 841,82 870,100
      C899,118 928,82 957,100
      C986,118 1015,82 1044,100
      C1073,118 1102,82 1131,100
      C1160,118 1189,82 1218,100
      C1247,118 1276,82 1305,100
      C1334,118 1363,82 1392,100
      C1416,110 1430,95 1440,100
      V0 H0 Z
    "
          />
        </svg>

        <div className="stats-container gradient-bg">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="stat-item">
                <div className="stat-icon-circle">{s.icon}</div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
        <svg className="stats-wave-bottom" viewBox="0 0 1440 240">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="
          M0,120
    C24,105 48,145 72,120
    C96,105 120,145 144,120
    C168,105 192,145 216,120
    C240,105 264,145 288,120
    C312,105 336,145 360,120
    C384,105 408,145 432,120
    C456,105 480,145 504,120
    C528,105 552,145 576,120
    C600,105 624,145 648,120
    C672,105 696,145 720,120
    C744,105 768,145 792,120
    C816,105 840,145 864,120
    C888,105 912,145 936,120
    C960,105 984,145 1008,120
    C1032,105 1056,145 1080,120
    C1104,105 1128,145 1152,120
    C1176,105 1200,145 1224,120
    C1248,105 1272,145 1296,120
    C1320,105 1344,145 1368,120
    C1384,122 1412,135 1440,120
    V240 H0 Z
  "
          />
        </svg>
      </section>

      {/* Partners */}
      <section className="partners-section">
        <div className="section-header">
          <h2 className="section-title">OUR AMAZING PARTNERS</h2>
          <div className="title-underline big"></div>
          <div className="title-underline small"></div>
        </div>
        <div className="partners-grid">
          {["MTN", "IBEDC", "AIRTEL", "DSTV", "GLO"].map((p, i) => (
            <div key={i} className="partner-logo">
              {p}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="testimonials-bg gradient-bg">
          <div className="container testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-content">
                  <div className="quote-icon">"</div>
                  <p className="testimonial-text">{t.text}</p>
                </div>
                <div className="testimonial-author">
                  <img
                    className="author-avatar"
                    src={t.avatar}
                    alt={`${t.name}'s avatar`}
                  />
                  <div className="author-name">{t.name}</div>
                  <div className="author-role">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="pricing-section">
        <div className="section-header">
          <h2 className="section-title">EXCLUSIVE DATA PRICES</h2>
          <div className="title-underline big"></div>
          <div className="title-underline small"></div>
          <p className="section-description">Our Affordable Data Prices</p>
        </div>

        <div className="data-plans-container">
          {Object.entries(dataPlans).map(([serviceName, plans]) => (
            <table key={serviceName} className="data-plans-table">
              <thead>
                <tr>
                  <th colSpan="4">{serviceName} Data Plans</th>
                </tr>
                <tr>
                  <th>Data Plan</th>
                  <th>Price (₦)</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr key={plan._id}>
                    <td>
                      {plan.planName} - {plan.validity}
                    </td>
                    <td>{plan.sellingPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
        <Link to="/login" className="btn btn-primary">
          PURCHASE
        </Link>
      </section>

      {/* FAQs */}
      <section id="faqs" className="faq-section">
        <div className="section-header">
          <h2 className="section-title">FREQUENTLY ASKED QUESTIONS</h2>
          <div className="title-underline big"></div>
          <div className="title-underline small"></div>
          <p className="section-description">
            Get answers to some of the frequently asked questions about our
            services.
          </p>
        </div>
        <div className="faq-container">
          <img className="faq-image" src={IT} alt="FAQ" />
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                >
                  <span>
                    {i + 1}. {faq.q}
                  </span>
                  <span
                    className={`chevron ${expandedFaq === i ? "rotate" : ""}`}
                  >
                    ▼
                  </span>
                </button>
                {expandedFaq === i && <div className="faq-answer">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download App */}
      <section className="download-section">
        <div className="download-container gradient-bg">
          <h2>DOWNLOAD OUR APP</h2>
          <div className="title-underline big"></div>
          <div className="title-underline small"></div>
          <p>
            Download VTVend Android app, compatible with all devices. Search for
            VTVend on playstore or click on the button below to download the app
            on Playstore. Will soon be available on App Store.
          </p>
          <button className="download-btn">available on PLAY STORE</button>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="contact-section">
        <div className="section-header">
          <h2 className="section-title">GET IN TOUCH</h2>
          <div className="title-underline big"></div>
          <div className="title-underline small"></div>
          <p className="section-description">
            Get in touch with us through any of the various ways below
          </p>
        </div>
        <div className="contact-grid">
          <div className="contact-card">
            <div className="contact-icon">📍</div>
            <h3>Office Address:</h3>
            <p>3 Kumasi Crescent, Wuse 2, Abuja.</p>
          </div>
          <div className="contact-card">
            <div className="contact-icon">✉️</div>
            <h3>E-mail Address:</h3>
            <p>info@vtvend.com</p>
          </div>
          <div className="contact-card">
            <div className="contact-icon">📞</div>
            <h3>Phone Number:</h3>
            <p>Call: +234 813 843 2055</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-section">
            <h3>VTVend</h3>
            <p>
              VTVend is a company of VTVend Nigeria Limited. We offer best deals
              when it comes to internet Data Plans, Airtime, Bills payment like
              GOTV, DSTV & STARTIMES.
            </p>
          </div>
          <div className="footer-section">
            <h4>OUR SERVICES</h4>
            <ul className="footer-links">
              {[
                "Buy Data",
                "Buy Airtime",
                "Bill Payment",
                "Bulks SMS",
                "Cable Subscription",
              ].map((s, i) => (
                <li key={i}>
                  <p>{s}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-section">
            <h4>USEFUL LINK</h4>
            <ul className="footer-links">
              {footerNavLinks.map((s, i) => (
                <li key={i}>
                  <a href={s.href}>{s.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>VTVend Copyright © 2025 All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
