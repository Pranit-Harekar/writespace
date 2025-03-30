import { Header } from '@/components/Header';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">About WriteSpace</h1>

        <section className="mb-8 prose lg:prose-xl">
          <p className="text-lg mb-4">
            WriteSpace is a global blogging platform designed to empower writers and connect readers
            from all over the world. Our mission is to create a space where ideas, stories, and
            perspectives can be shared freely and meaningfully. We believe that every individual has
            a unique story to tell, and WriteSpace exists to provide the tools, resources, and
            community to bring those stories to life.
          </p>

          <p className="text-lg mb-4">
            In a world where communication is increasingly digital, WriteSpace stands as a beacon
            for authentic storytelling and meaningful connections. We aim to bridge the gap between
            writers and readers, fostering a global community that celebrates creativity, diversity,
            and the power of the written word.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Our Story</h2>
          <p className="mb-4">
            Founded in 2025, WriteSpace was born out of a desire to provide a platform for writers
            to express themselves and for readers to discover diverse content. The idea originated
            from a small group of passionate storytellers who recognized the need for a space where
            creativity could flourish without boundaries. Over the years, WriteSpace has grown into
            a vibrant community of writers, readers, and creators from all walks of life.
          </p>

          <p className="mb-4">
            Our journey began with a simple question: "What if there was a place where anyone could
            share their story, regardless of their background or experience?" This question became
            the foundation of WriteSpace, and it continues to guide our vision as we expand and
            evolve. From humble beginnings as a small startup, we have grown into a platform that
            reaches millions of users worldwide, yet our core values remain unchanged.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
          <p className="mb-4">
            At WriteSpace, we are committed to creating a platform that empowers writers, inspires
            readers, and fosters a sense of community. Our mission is built on the following
            principles:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">
              <strong>Empowering Writers:</strong> We provide writers with the tools and resources
              they need to share their unique voices and reach a global audience. Whether you're a
              seasoned author or a first-time blogger, WriteSpace is here to support your journey.
            </li>
            <li className="mb-2">
              <strong>Connecting Readers:</strong> Our platform is designed to help readers discover
              diverse and inspiring content. From thought-provoking essays to captivating stories,
              WriteSpace offers something for everyone.
            </li>
            <li className="mb-2">
              <strong>Fostering Community:</strong> We believe in the power of storytelling to bring
              people together. WriteSpace is more than just a platform—it's a global community of
              storytellers, united by a shared passion for creativity and connection.
            </li>
            <li className="mb-2">
              <strong>Encouraging Creativity:</strong> Creativity is at the heart of everything we
              do. We strive to create an environment where writers can experiment, innovate, and
              push the boundaries of their craft.
            </li>
            <li className="mb-2">
              <strong>Supporting Growth:</strong> We are dedicated to helping writers grow, both
              personally and professionally. From writing tips and workshops to networking
              opportunities, WriteSpace is here to help you succeed.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Our Team</h2>
          <p className="mb-4">
            WriteSpace is built by a dedicated team of writers, developers, and creatives who are
            passionate about storytelling and technology. Our team brings together a diverse range
            of skills and experiences, united by a shared belief in the transformative power of
            stories. From our engineers who build innovative features to our content creators who
            craft engaging narratives, every member of the WriteSpace team plays a vital role in
            bringing our vision to life.
          </p>

          <p className="mb-4">
            We are proud to work alongside a global network of contributors, including writers,
            editors, and designers, who share our commitment to excellence. Together, we strive to
            create a platform that not only meets the needs of our users but also exceeds their
            expectations.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Join Us</h2>
          <p className="mb-4">
            Whether you're a writer looking to share your stories or a reader eager to explore new
            perspectives, WriteSpace welcomes you. Join our growing community and be part of our
            mission to celebrate creativity and connection through the written word. By becoming a
            member of WriteSpace, you'll gain access to a wealth of resources, including writing
            tools, publishing opportunities, and a supportive network of fellow storytellers.
          </p>

          <p className="mb-4">
            We invite you to embark on this journey with us. Together, we can create a world where
            every story matters, every voice is heard, and every connection is meaningful. Thank you
            for being a part of WriteSpace—we can't wait to see what you'll create.
          </p>
        </section>
      </main>
    </div>
  );
};

export default About;
