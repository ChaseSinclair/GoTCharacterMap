import React from 'react';
import * as d3 from 'd3';
import './Graph.scss';

const propTypes = {
  // nodes: Prop
};

const defaultProps = {
};


class Graph extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      simulation: null,
    };
    this.svgWidth = 960;
    this.svgHeight = 600;
    this.dragended = this.dragended.bind(this);
    this.dragged = this.dragged.bind(this);
    this.dragstarted = this.dragstarted.bind(this);
    this.ticked = this.ticked.bind(this);

    this.color = d3.scaleOrdinal(d3.schemeCategory20);
    this.link = null;
    this.node = null;
  }

  componentDidMount() {
    console.log('component did update');
    
    const svg = d3.select('svg');
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    const simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(d => d.id))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2));

    d3.json("gameofthrones.json", graph => {
      console.log("hi");
      console.log(graph);
      console.log(this);
      this.link = svg.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(graph.links)
        .enter().append('line')
          .attr('stroke-width', d => Math.sqrt(d.value));
          
      this.node = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('square')
        .data(graph.nodes)
        .enter()
        .append('circle')
          .attr('r', 5)
          .attr('text', d => d.id)
          .attr('fill', d => d.color)
          .call(d3.drag()
              .on('start', this.dragstarted)
              .on('drag', this.dragged)
              .on('end', this.dragended));
              
      this.node.append('title').text(d => `${d.id}`);
      
      simulation
        .nodes(graph.nodes)
        .on('tick', this.ticked);
      
      simulation
        .force('link')
        .links(graph.links);
      
      this.setState({ simulation });
    });
  }

  ticked() {
    this.link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    this.node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
  }

  dragstarted(d) {
    if (!d3.event.active) this.state.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  dragended(d) {
    if (!d3.event.active) this.state.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }


  render() {
    return (
      <svg width={this.svgWidth} height={this.svgHeight} />
    );
  }
}


Graph.propTypes = propTypes;
Graph.defaultProps = defaultProps;

export default Graph;


// const getRadius = function(d) {
//     return graph.links.filter((x) => d.id === x.target).length + 5;
//   };
