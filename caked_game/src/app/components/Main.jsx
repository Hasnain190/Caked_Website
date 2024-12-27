"use client";
import React from "react";

import { Cake, Gamepad2, ShoppingCart } from "lucide-react";
import gameImage from "../assets/gamess.png";
import CakeBgImage from "@/app/assets/cake-bg.png";
import Image from "next/image";
import Button from "./Button";
import CupCakeImage from "@/app/assets/Cupcakes.jpg";
// Main App Component
const CakeGameApp = () => {
  return (
    <div className="min-h-screen bg-pink-50 font-sans scroll-smooth">
      <Header />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

// Header Component
const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Cake className="text-pink-500" />
          <h1 className="text-xl font-bold text-pink-600">Cake Adventure</h1>
        </div>
        <ul className="flex space-x-4">
          <li>
            <a href="#home" className="hover:text-pink-500">
              Home
            </a>
          </li>
          <li>
            <a href="#about" className="hover:text-pink-500">
              About
            </a>
          </li>
          <li>
            <a href="#features" className="hover:text-pink-500">
              Features
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

// Hero Section Component
const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center text-center"
      style={{
        backgroundImage: `url(${CakeBgImage.src})`,
        backgroundSize: "40%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left",
      }}
    >
      <div className="bg-white/80 p-10 rounded-xl shadow-2xl max-w-xl w-full">
        <h2 className="text-4xl font-bold mb-4 text-pink-600">
          Cake Adventure: Create, Craft, Order
        </h2>
        <p className="mb-6 text-gray-700">
          We are developing a game where you can craft and customize your dream
          cake while playing it and then order it online.
        </p>
        <p className="mb-6 text-gray-700">
          If you are interested in this idea, please subscribe to our
          newsletter. We will notify you when the game is launched.
        </p>
        <Button />
      </div>
    </section>
  );
};

// About Section Component
const AboutSection = () => {
  return (
    <section
      id="about"
      className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-10"
    >
      <div>
        <h3 className="text-3xl font-bold mb-4 text-pink-600">
          More Than Just a Cake Game
        </h3>
        <p className="mb-4">
          Cake Adventure is a unique game that blends the excitement of game
          design with the deliciousness of custom cakes. Imagine creating your
          perfect cake through an engaging, interactive game experience and then
          seeing it in reality.
        </p>
        <ul className="space-y-2">
          <li className="flex items-center">
            <Gamepad2 className="mr-2 text-pink-500" />
            Interactive Cake Design Game
          </li>
          <li className="flex items-center">
            <Cake className="mr-2 text-pink-500" />
            Unlimited Customization Options
          </li>
          <li className="flex items-center">
            <ShoppingCart className="mr-2 text-pink-500" />
            Seamless Ordering Process
          </li>
        </ul>
      </div>
      <div className="flex items-center justify-center">
        <Image
          src={gameImage}
          alt="CakeAdventure Concept"
          className="rounded-xl shadow-lg "
        />
      </div>
    </section>
  );
};

// Features Section Component
const FeaturesSection = () => {
  const features = [
    {
      icon: <Cake className="text-4xl text-pink-500" />,
      title: "You will design Your Cake",
      description:
        "Create your dream cake with a wide range of design elements and customization options.",
    },

    {
      icon: <ShoppingCart className="text-4xl text-pink-500" />,
      title: "Easy Ordering",
      description:
        "Transform your cake design into a real, deliverable cake with one click.",
    },
  ];

  return (
    <section id="features" className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold text-center mb-10 text-pink-600">
          How this Game will Works
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 bg-pink-50 rounded-xl">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center text-center"
      style={{
        backgroundImage: `url(${CupCakeImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white/80 p-10 rounded-xl shadow-2xl max-w-xl w-full">
        <h2 className="text-4xl font-bold mb-4 text-pink-600">
          So what do you think of this idea
        </h2>
        <p className="mb-6 text-gray-700">
          If you think this idea is worth your time, let&apos;s get in touch!
        </p>
        <Button />
      </div>
    </section>
  );
};
// Footer Component
const Footer = () => {
  return (
    <footer className="bg-pink-600 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; 2025 CakeAdventure. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default CakeGameApp;
