import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">About WriteSpace</h1>

        <section className="mb-8 prose lg:prose-xl">
          <p className="text-lg mb-4">
            WriteSpace is a multilingual blogging platform designed for the diverse linguistic
            landscape of India. Our mission is to connect writers and readers across language
            barriers, enabling meaningful exchange of ideas, stories, and perspectives.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Our Story</h2>
          <p className="mb-4">
            Founded in 2025, WriteSpace emerged from a simple observation: while India has
            incredible linguistic diversity with over 22 official languages and hundreds of
            dialects, online content creation remains predominantly English-centric. We set out to
            create a platform where writers could express themselves in their native languages and
            readers could discover content across language boundaries.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
          <p className="mb-4">
            At WriteSpace, we believe that everyone's voice deserves to be heard. Our platform aims
            to:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">Empower writers to publish in multiple Indian languages</li>
            <li className="mb-2">
              Connect readers with diverse content they might otherwise never discover
            </li>
            <li className="mb-2">Preserve and promote India's linguistic heritage</li>
            <li className="mb-2">Foster cross-cultural understanding through translated content</li>
            <li className="mb-2">Create a supportive community for writers of all backgrounds</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Our Team</h2>
          <p className="mb-4">
            WriteSpace is built by a passionate team of writers, developers, and language
            enthusiasts from across India. We're united by our love for languages and our belief in
            the power of stories to bring people together.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Join Us</h2>
          <p className="mb-4">
            Whether you're a writer looking to share your voice or a reader eager to explore diverse
            perspectives, WriteSpace welcomes you. Join our growing community and be part of our
            mission to celebrate India's linguistic diversity through the written word.
          </p>
        </section>
      </main>
    </div>
  );
};

export default About;
