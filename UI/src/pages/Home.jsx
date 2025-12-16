import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Target, Eye, Award, TrendingUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeroSlider from '@/components/HeroSlider';

const Home = () => {
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80',
      title: 'Empowering Your Workforce',
      subtitle: 'Strategic HR solutions to build, engage, and retain top talent.',
    },
    {
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
      title: 'Driving Business Growth',
      subtitle: 'Aligning HR strategies with your business objectives for sustainable success.',
    },
    {
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      title: 'Your Partner in Excellence',
      subtitle: 'Comprehensive services from recruitment to payroll and corporate training.',
    },
  ];

  const stats = [
    { number: '500+', label: 'Successful Placements', icon: Users },
    { number: '100+', label: 'Corporate Clients', icon: Award },
    { number: '15+', label: 'Years Experience', icon: TrendingUp },
    { number: '99%', label: 'Client Satisfaction', icon: Shield },
  ];

  const services = [
    {
      title: 'HR Payroll',
      description: 'Comprehensive payroll management solutions for businesses of all sizes.',
      icon: '💼',
    },
    {
      title: 'Placement Services',
      description: 'Expert recruitment and placement services to find the right talent.',
      icon: '🎯',
    },
    {
      title: 'Staffing Solutions',
      description: 'Flexible staffing solutions tailored to your business needs.',
      icon: '👥',
    },
    {
      title: 'Corporate Training',
      description: 'Professional development and training programs for your team.',
      icon: '📚',
    },
  ];

  return (
    <>
      <Helmet>
        <title>QXI HR Pvt Ltd - Professional HR Consultancy Services</title>
        <meta name="description" content="QXI HR Pvt Ltd is a leading HR consultancy providing comprehensive solutions including payroll management, recruitment, staffing, and corporate training services." />
        <meta property="og:title" content="QXI HR Pvt Ltd - Professional HR Consultancy Services" />
        <meta property="og:description" content="Your trusted partner in HR solutions, providing comprehensive services for recruitment, staffing, payroll management, and corporate training." />
      </Helmet>

      <HeroSlider slides={slides} />

      {/* Stats Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 corporate-gradient rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                About QXI HR Pvt Ltd
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                QXI HR Pvt Ltd is a leading HR consultancy firm dedicated to providing comprehensive 
                human resource solutions to businesses across various industries. With over 15 years 
                of experience, we have established ourselves as a trusted partner for companies 
                seeking professional HR services.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our team of experienced professionals specializes in recruitment, staffing solutions, 
                payroll management, and corporate training, helping organizations build strong, 
                efficient, and productive teams.
              </p>
              <Button asChild size="lg" className="corporate-gradient text-white">
                <Link to="/about-us">
                  Learn More About Us <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img  
                className="rounded-lg shadow-2xl w-full h-96 object-cover"
                alt="Professional HR team in modern office environment"
               src="https://images.unsplash.com/photo-1681184025442-1517cb9319c1" />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 corporate-gradient rounded-full flex items-center justify-center">
                <Award className="w-12 h-12 text-white" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Mission & Vision
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Driving excellence in human resource management through innovative solutions and dedicated service.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl p-8 shadow-lg hover-lift"
            >
              <div className="w-16 h-16 corporate-gradient rounded-full flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To provide exceptional HR consultancy services that empower organizations to achieve 
                their business objectives through strategic human resource management, innovative 
                solutions, and sustainable growth practices.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-8 shadow-lg hover-lift"
            >
              <div className="w-16 h-16 corporate-gradient rounded-full flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be the most trusted and preferred HR consultancy firm, recognized for our 
                commitment to excellence, innovation, and creating lasting partnerships that 
                drive organizational success and employee satisfaction.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive HR solutions tailored to meet your business needs and drive organizational success.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover-lift text-center"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg" className="corporate-gradient text-white">
              <Link to="/services">
                View All Services <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding corporate-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-shadow">
              Ready to Transform Your HR Operations?
            </h2>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Let our experienced team help you build a stronger, more efficient organization 
              with our comprehensive HR solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                <Link to="/contact">
                  Get Started Today <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white bg-transparent hover:bg-white hover:text-gray-900">
                <Link to="/job-seekers">
                  Find Opportunities
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;